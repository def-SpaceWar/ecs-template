import { getComponent, getComponents, getComponentsOfTypes, isComponent } from "../component";
import type { Scene } from "../../util/scene_manager";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector } from "../../util/vector";
import { Velocity } from "./velocity";
import { RectangleCollider, getRectPoints } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { type Polygon, Collision } from "../../util/collision";
import { Behavior } from "../primitive/behavior";
import { Acceleration } from "./acceleration";
import { Drag } from "./drag";
import { Mass } from "./mass";
import { Restitution } from "./restitution";
import { CircleCollider, getCirclePoints } from "./circle_collider";
import { EllipseCollider, getEllipsePoints } from "./ellipse_collider";
import { RotationalVelocity } from "./rotational_velocity";
import { RotationalResistence } from "./rotational_resistence";
import { CollisionTag } from "./collision_tag";

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


        const rotation = getComponent(e, Rotation);
        const rotationalVelocity = getComponent(e, RotationalVelocity);
        if (rotation && rotationalVelocity) {
            rotation.angle += rotationalVelocity.vel * dt;

            const rotationalResistence = getComponent(e, RotationalResistence);
            if (rotationalResistence) {
                rotationalVelocity.vel *= Math.exp(dt * Math.log(rotationalResistence.resistence));
            }
        }
    }
};

type Collider = RectangleCollider
    | CircleCollider
    | EllipseCollider;
type ColliderInfo = [
    Position,
    Collider[],
    Rotation?
];

const getPoints = (colliderInfo: ColliderInfo): Polygon => {
    const points: Polygon = [];

    for (let i = 0; i < colliderInfo[1].length; i++) {
        const collider = colliderInfo[1][i];

        if (isComponent(RectangleCollider, collider)) {
            points.push(...getRectPoints([
                colliderInfo[0],
                collider,
                colliderInfo[2]
            ]));
        }

        if (isComponent(CircleCollider, collider)) {
            points.push(...getCirclePoints([
                colliderInfo[0],
                collider,
            ]));
        }

        if (isComponent(EllipseCollider, collider)) {
            points.push(...getEllipsePoints([
                colliderInfo[0],
                collider,
                colliderInfo[2]
            ]));
        }
    }

    return points;
};

const updateCollisions = (scene: Scene) => {
    for (let e1 = 0; e1 < scene.totalEntities(); e1++) {
        const position1 = getComponent(e1, Position);
        const velocity1 = getComponent(e1, Velocity);
        const rotation1 = getComponent(e1, Rotation);
        const collisionTag1 = getComponent(e1, CollisionTag);
        const collider1s = getComponentsOfTypes<Collider>(e1, [RectangleCollider, CircleCollider, EllipseCollider]);
        if (!(position1 && collider1s.length > 0)) continue;
        const colliderInfo1: ColliderInfo = [position1, collider1s, rotation1];
        for (let e2 = e1 + 1; e2 < scene.totalEntities(); e2++) {
            const position2 = getComponent(e2, Position);
            const velocity2 = getComponent(e2, Velocity);
            const rotation2 = getComponent(e2, Rotation);
            const collisionTag2 = getComponent(e2, CollisionTag);
            if (collisionTag1?.tag == collisionTag2?.tag) continue;
            const collider2s = getComponentsOfTypes<Collider>(e2, [RectangleCollider, CircleCollider, EllipseCollider]);
            if (!(position2 && collider2s.length > 0)) continue;
            const colliderInfo2: ColliderInfo = [position2, collider2s, rotation2];
            if (!Collision.arePolygonsColliding(getPoints(colliderInfo1), getPoints(colliderInfo2))) continue;

            const collisionPoint = Collision.pointOfCollision(
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

            const normal = Collision.normalOfCollision(
                [colliderInfo2[0], getPoints(colliderInfo2)],
                [colliderInfo1[0], getPoints(colliderInfo1)],
            );

            Collision.resolveCollision([
                position1,
                () => getPoints(colliderInfo1),
                velocity1,
                getComponent(e1, Mass),
                getComponent(e1, Restitution),
                getComponent(e1, RotationalVelocity)
            ], [
                position2,
                () => getPoints(colliderInfo2),
                velocity2,
                getComponent(e2, Mass),
                getComponent(e2, Restitution),
                getComponent(e2, RotationalVelocity)
            ], normal, collisionPoint);
        }
    }
};

export function createPhysicsSystem(): System {
    return (scene: Scene, dt: number) => {
        updateVelocities(scene, dt);
        updateCollisions(scene);
    };
}
