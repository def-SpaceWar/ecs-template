import { getComponent, getComponents } from "../component";
import type { Scene } from "../../util/scene_manager";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector } from "../../util/vector";
import { Velocity } from "./velocity";
import { type RectInfo, RectangleCollider, getRectPoints } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { arePolygonsColliding, polygonCollisionResolution } from "../../util/collision";
import { Behavior } from "../primitive/behavior";
import { Acceleration } from "./acceleration";
import add = Vector.add;
import scale = Vector.scale;
import { Drag } from "./drag";

const updateVelocities = (scene: Scene, dt: number) => {
    for (let e = 0; e < scene.totalEntities(); e++) {
        const velocity = getComponent(e, Velocity);
        if (!velocity) continue;
        const position = getComponent(e, Position);
        if (position) {
            position.pos = add(position.pos, scale(velocity.vel, dt));
        }

        const acceleration = getComponent(e, Acceleration);
        if (acceleration) {
            velocity.vel = add(scale(acceleration.acc, dt), velocity.vel);
        }

        const drag = getComponent(e, Drag);
        if (drag) {
            velocity.vel = scale(velocity.vel, Math.exp(dt * Math.log(drag.drag)));
        }
    }
};

const areRectsColliding = (r1: RectInfo, r2: RectInfo) =>
    arePolygonsColliding(getRectPoints(r1), getRectPoints(r2));

const stopRectsColliding = (r1: RectInfo, r2: RectInfo) => {
    let kb1 = 0, kb2 = 0;

    const v1 = getComponent(r1[0].entity, Velocity);
    if (v1) kb1 = 1;
    const v2 = getComponent(r2[0].entity, Velocity);
    if (v2) kb2 = 1;

    // mass component soon!

    if (kb1 == 0 && kb2 == 0) kb1 = 0.5, kb2 = 0.5;

    const d = polygonCollisionResolution(r1[0].pos, getRectPoints(r1), r2[0].pos, getRectPoints(r2));
    r1[0].pos = Vector.add(r1[0].pos, Vector.scale(d, kb1 * 0.5));
    r2[0].pos = Vector.add(r2[0].pos, Vector.scale(d, -kb2 * 0.5));
};

const checkCollisions = (scene: Scene, dt: number) => {
    for (let e1 = 0; e1 < scene.totalEntities(); e1++) {
        const position1 = getComponent(e1, Position);
        const rotation1 = getComponent(e1, Rotation);
        const rectCollider1s = getComponents(e1, RectangleCollider);
        for (let i = 0; i < rectCollider1s.length; i++) {
            const rectCollider1 = rectCollider1s[i];
            if (!(position1 && rectCollider1)) continue;
            for (let e2 = e1 + 1; e2 < scene.totalEntities(); e2++) {
                const position2 = getComponent(e2, Position);
                const rotation2 = getComponent(e2, Rotation);
                const rectCollider2s = getComponents(e2, RectangleCollider);
                for (let j = 0; j < rectCollider2s.length; j++) {
                    const rectCollider2 = rectCollider2s[j];
                    if (!(position2 && rectCollider2)) continue;

                    if (
                        !areRectsColliding([
                            position1,
                            rectCollider1,
                            rotation1
                        ], [
                            position2,
                            rectCollider2,
                            rotation2
                        ])
                    ) continue;

                    const behaviors1 = getComponents(e1, Behavior);
                    behaviors1.forEach(b => {
                        if (b.behavior.onCollision) {
                            b.behavior.onCollision(e2, dt);
                        }
                    });

                    const behaviors2 = getComponents(e2, Behavior);
                    behaviors2.forEach(b => {
                        if (b.behavior.onCollision) {
                            b.behavior.onCollision(e1, dt);
                        }
                    });

                    stopRectsColliding([
                        position1,
                        rectCollider1,
                        rotation1
                    ], [
                        position2,
                        rectCollider2,
                        rotation2
                    ]);
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

    return (scene: Scene, dt: number) => {
        tpsText.innerText = `TPS: ${1 / dt}`;
        updateVelocities(scene, dt);
        checkCollisions(scene, dt);
    };
}
