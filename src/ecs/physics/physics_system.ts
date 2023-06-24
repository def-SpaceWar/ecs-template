import { getComponent, getComponents, isComponent } from "../component";
import type { Scene } from "../../util/scene_manager";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector, type Vector2D } from "../../util/vector";
import { Velocity } from "./velocity";
import { RectangleCollider, getRectPoints } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { type Polygon, arePolygonsColliding, normalOfCollision, pointOfCollision, resolveCollision } from "../../util/collision";
import { Behavior } from "../primitive/behavior";
import { Acceleration } from "./acceleration";
import { Drag } from "./drag";
import { Mass } from "./mass";
import { Restitution } from "./restitution";
import { CircleCollider, getCirclePoints } from "./circle_collider";
import { EllipseCollider, getEllipsePoints } from "./ellipse_collider";
import { RotationalVelocity } from "./rotational_velocity";
import { RotationalResistence } from "./rotational_resistence";

const updateVelocities = (scene: Scene, dt: number) => {
    for (let e = 0; e < scene.totalEntities(); e++) {
        const velocity = getComponent(e, Velocity);
        if (velocity) {
            const position = getComponent(e, Position);
            if (position) {
                position.pos = Vector.add(position.pos, Vector.scale(velocity.vel, dt));
            }

            const acceleration = getComponent(e, Acceleration);
            if (acceleration) {
                velocity.vel = Vector.add(Vector.scale(acceleration.acc, dt), velocity.vel);
            }

            const drag = getComponent(e, Drag);
            if (drag) {
                velocity.vel = Vector.scale(velocity.vel, Math.exp(dt * Math.log(drag.drag)));
            }
        }

        const rotationalVelocity = getComponent(e, RotationalVelocity);
        if (rotationalVelocity) {
            const rotationalResistence = getComponent(e, RotationalResistence);
            const rotation = getComponent(e, Rotation);

            if (!rotation) break;
            if (rotationalResistence) {
                rotation.angle += rotationalVelocity.vel * dt * rotationalResistence.resistence;
            } else {
                rotation.angle += rotationalVelocity.vel * dt;
            }
            if (rotation.angle > Math.PI * 2) rotation.angle = rotation.angle % (Math.PI * 2);
            if (rotation.angle < 0) rotation.angle += Math.PI * 2;
        }
    }
};

type Collider = RectangleCollider
    | CircleCollider
    | EllipseCollider;
type ColliderInfo = [
    Position,
    Collider,
    Rotation?
];

const getPoints = (colliderInfo: ColliderInfo): Polygon => {
    if (isComponent(RectangleCollider, colliderInfo[1])) {
        return getRectPoints([
            colliderInfo[0],
            colliderInfo[1],
            colliderInfo[2]
        ]);
    }

    if (isComponent(CircleCollider, colliderInfo[1])) {
        return getCirclePoints([
            colliderInfo[0],
            colliderInfo[1]
        ]);
    }

    if (isComponent(EllipseCollider, colliderInfo[1])) {
        return getEllipsePoints([
            colliderInfo[0],
            colliderInfo[1],
            colliderInfo[2]
        ]);
    }

    return [];
};

const updateCollisions = (scene: Scene, dt: number) => {
    for (let e1 = 0; e1 < scene.totalEntities(); e1++) {
        const position1 = getComponent(e1, Position);
        const velocity1 = getComponent(e1, Velocity);
        const rotation1 = getComponent(e1, Rotation);
        const collider1s = [
            ...getComponents(e1, RectangleCollider),
            ...getComponents(e1, CircleCollider),
            ...getComponents(e1, EllipseCollider)
        ];
        for (let i = 0; i < collider1s.length; i++) {
            const collider1 = collider1s[i];
            if (!(position1 && collider1)) continue;
            const colliderInfo1: ColliderInfo = [position1, collider1, rotation1];
            for (let e2 = e1 + 1; e2 < scene.totalEntities(); e2++) {
                const position2 = getComponent(e2, Position);
                const velocity2 = getComponent(e2, Velocity);
                const rotation2 = getComponent(e2, Rotation);
                const collider2s = [
                    ...getComponents(e2, RectangleCollider),
                    ...getComponents(e2, CircleCollider),
                    ...getComponents(e2, EllipseCollider)
                ];
                for (let j = 0; j < collider2s.length; j++) {
                    const collider2 = collider2s[j];
                    if (!(position2 && collider2)) continue;
                    const colliderInfo2: ColliderInfo = [position2, collider2, rotation2];
                    if (!arePolygonsColliding(getPoints(colliderInfo1), getPoints(colliderInfo2))) continue;

                    const collisionPoint = pointOfCollision(
                        getPoints(colliderInfo2),
                        getPoints(colliderInfo1),
                    );

                    const behaviors1 = getComponents(e1, Behavior);
                    behaviors1.forEach(b => {
                        if (b.behavior.onCollision) {
                            b.behavior.onCollision(e2, collisionPoint);
                        }
                    });

                    const behaviors2 = getComponents(e2, Behavior);
                    behaviors2.forEach(b => {
                        if (b.behavior.onCollision) {
                            b.behavior.onCollision(e1, collisionPoint);
                        }
                    });

                    const normal = normalOfCollision(
                        [colliderInfo2[0], getPoints(colliderInfo2)],
                        [colliderInfo1[0], getPoints(colliderInfo1)],
                    );

                    resolveCollision([
                        position1,
                        velocity1,
                        getComponent(e1, Mass),
                        getComponent(e1, Restitution),
                        getComponent(e1, Rotation),
                        getComponent(e1, RotationalVelocity)
                    ], [
                        position2,
                        velocity2,
                        getComponent(e2, Mass),
                        getComponent(e2, Restitution),
                        getComponent(e2, Rotation),
                        getComponent(e2, RotationalVelocity)
                    ], normal, collisionPoint);
                }
            }
        }
    }
};

export function createPhysicsSystem(): System {
    const tpsText = document.getElementById('app')!.appendChild(
        document.createElement('p')
    );
    tpsText.id = "tps";

    const tpsCounts: number[] = [];
    const average = () => {
        if (tpsCounts.length > 100) tpsCounts.shift();
        const total = tpsCounts.reduce((p, v) => v + p, 0);
        return Math.floor(total / tpsCounts.length);
    },
        max = () => Math.floor(Math.max(...tpsCounts)),
        min = () => Math.floor(Math.min(...tpsCounts));

    return (scene: Scene, dt: number) => {
        tpsCounts.push(1 / dt);
        tpsText.innerText = `TPS: ${average()}; [${min()}, ${max()}]`;
        updateVelocities(scene, dt);
        updateCollisions(scene, dt);
    };
}
