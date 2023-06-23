import { getComponent, getComponents } from "../component";
import type { Scene } from "../../util/scene_manager";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector } from "../../util/vector";
import { Velocity } from "./velocity";
import { type RectInfo, RectangleCollider, getRectPoints } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { arePolygonsColliding, normalOfCollision, pointOfCollision, resolveCollision } from "../../util/collision";
import { Behavior } from "../primitive/behavior";
import { Acceleration } from "./acceleration";
import { Drag } from "./drag";
import { Mass } from "./mass";
import { Restitution } from "./restitution";

const updateVelocities = (scene: Scene, dt: number) => {
    for (let e = 0; e < scene.totalEntities(); e++) {
        const velocity = getComponent(e, Velocity);
        if (!velocity) continue;
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
};

const updateCollisions = (scene: Scene) => {
    for (let e1 = 0; e1 < scene.totalEntities(); e1++) {
        const position1 = getComponent(e1, Position);
        const velocity1 = getComponent(e1, Velocity);
        const rotation1 = getComponent(e1, Rotation);
        const rectCollider1s = getComponents(e1, RectangleCollider);
        for (let i = 0; i < rectCollider1s.length; i++) {
            const rectCollider1 = rectCollider1s[i];
            if (!(position1 && rectCollider1 && velocity1)) continue;
            const r1: RectInfo = [position1, rectCollider1, rotation1];
            for (let e2 = e1 + 1; e2 < scene.totalEntities(); e2++) {
                const position2 = getComponent(e2, Position);
                const velocity2 = getComponent(e2, Velocity);
                const rotation2 = getComponent(e2, Rotation);
                const rectCollider2s = getComponents(e2, RectangleCollider);
                for (let j = 0; j < rectCollider2s.length; j++) {
                    const rectCollider2 = rectCollider2s[j];
                    if (!(position2 && rectCollider2 && velocity2)) continue;
                    const r2: RectInfo = [position2, rectCollider2, rotation2];
                    if (!arePolygonsColliding(getRectPoints(r1), getRectPoints(r2))) continue;

                    const collisionPoint = pointOfCollision(
                        getRectPoints(r2),
                        getRectPoints(r1),
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
                        [r2[0], getRectPoints(r2)],
                        [r1[0], getRectPoints(r1)],
                    );

                    resolveCollision([
                        position1,
                        velocity1,
                        getComponent(e1, Mass),
                        getComponent(e1, Restitution)
                    ], [
                        position2,
                        velocity2,
                        getComponent(e2, Mass),
                        getComponent(e2, Restitution)
                    ], normal);
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
        updateCollisions(scene);
    };
}
