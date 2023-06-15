import { type Component, getComponent, getComponents } from "../component";
import { totalEntities } from "../entity";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector } from "../../util/vector";
import { Velocity } from "./velocity";
import { type RectInfo, RectangleCollider, getRectPoints } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { arePolygonsColliding, polygonCollisionResolution } from "../../util/collision";
import { Behavior } from "../primitive/behavior";

const areRectsColliding = (r1: RectInfo, r2: RectInfo) =>
    arePolygonsColliding(getRectPoints(r1), getRectPoints(r2));

const stopRectsColliding = (r1: RectInfo, r2: RectInfo, components: Component[]) => {
    let kb1 = 0, kb2 = 0;

    if (getComponent(r1[0].entity, Velocity, components)) kb1 = 1;
    if (getComponent(r2[0].entity, Velocity, components)) kb2 = 1;

    // mass component soon!

    if (kb1 == 0 && kb2 == 0) kb1 = 0.5, kb2 = 0.5;
    [kb1, kb2] = Vector.normalize([kb1, kb2]);

    const d = polygonCollisionResolution(r1[0].pos, getRectPoints(r1), r2[0].pos, getRectPoints(r2));
    r1[0].pos = Vector.add(r1[0].pos, Vector.scale(d, kb1));
    r2[0].pos = Vector.add(r2[0].pos, Vector.scale(d, -kb2));
};

const updateVelocities = (components: Component[], dt: number) => {
    for (let e = 0; e < totalEntities(); e++) {
        const velocity = getComponent(e, Velocity, components);
        if (velocity) {
            const position = getComponent(e, Position, components);
            if (position) {
                position.pos = Vector.add(position.pos, Vector.scale(velocity.vel, dt));
            }
        }
    }
};

const checkCollisions = (components: Component[], dt: number) => {
    for (let e1 = 0; e1 < totalEntities(); e1++) {
        const position1 = getComponent(e1, Position, components);
        const rotation1 = getComponent(e1, Rotation, components);
        const rectCollider1 = getComponent(e1, RectangleCollider, components);
        if (!(position1 && rectCollider1)) continue;

        for (let e2 = e1 + 1; e2 < totalEntities(); e2++) {
            const position2 = getComponent(e2, Position, components);
            const rotation2 = getComponent(e2, Rotation, components);
            const rectCollider2 = getComponent(e2, RectangleCollider, components);
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

            const behaviors1 = getComponents(e1, Behavior, components);
            behaviors1.forEach(b => {
                if (b.behavior.onCollision) {
                    b.behavior.onCollision(e2, components, dt);
                }
            });

            const behaviors2 = getComponents(e2, Behavior, components);
            behaviors2.forEach(b => {
                if (b.behavior.onCollision) {
                    b.behavior.onCollision(e1, components, dt);
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
            ], components);
        }
    }
};

export function createPhysicsSystem(): System {
    return (components: Component[], dt: number) => {
        updateVelocities(components, dt);
        checkCollisions(components, dt);
    };
}
