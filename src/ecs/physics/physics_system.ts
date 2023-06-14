import { type Component, getComponent, getComponents } from "../component";
import { totalEntities } from "../entity";
import { Position } from "../render/position";
import type { System } from "../system";
import { Vector, Vector2D } from "../../util/vector";
import add = Vector.add;
import scale = Vector.scale;
import rotate = Vector.rotate;
import { Velocity } from "./velocity";
import { RectangleCollider } from "./rectangle_collider";
import { Rotation } from "../render/rotation";
import { arePolygonsColliding } from "../../util/collision";
import { Behavior } from "../primitive/behavior";

type RectInfo = [
    Position,
    RectangleCollider,
    Rotation?
];

const getRectPoints = (r: RectInfo): Vector2D[] => {
    const angle = r[2]?.angle || 0;
    const rectCenter = add(r[0].pos, r[1].pos);
    return [
        rotate(add(rectCenter, scale(r[1].dims, 0.5)), angle, r[0].pos),
        rotate(add(rectCenter, scale([-r[1].dims[0], r[1].dims[1]], 0.5)), angle, r[0].pos),
        rotate(add(rectCenter, scale(r[1].dims, -0.5)), angle, r[0].pos),
        rotate(add(rectCenter, scale([r[1].dims[0], -r[1].dims[1]], 0.5)), angle, r[0].pos)
    ];
};

const areRectsColliding = (r1: RectInfo, r2: RectInfo) =>
    arePolygonsColliding(getRectPoints(r1), getRectPoints(r2));

const updateVelocities = (components: Component[], dt: number) => {
    for (let e = 0; e < totalEntities(); e++) {
        const velocity = getComponent(e, Velocity, components);
        if (velocity) {
            const position = getComponent(e, Position, components);
            if (position) {
                position.pos = add(position.pos, scale(velocity.vel, dt));
            }
        }
    }
};

type RectCollisionInfo = [
    Position,
    RectangleCollider,
    Velocity?
];

const stopRectsColliding = (r1: RectCollisionInfo, r2: RectCollisionInfo) => {
    r1;
    r2;
    // watch that OLC video on polygon collision handling and stuff
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

            const velocity1 = getComponent(e1, Velocity, components);
            const velocity2 = getComponent(e2, Velocity, components);
            stopRectsColliding([
                position1,
                rectCollider1,
                velocity1
            ], [
                position2,
                rectCollider2,
                velocity2
            ]);
        }
    }
};

export function createPhysicsSystem(): System {
    return (components: Component[], dt: number) => {
        updateVelocities(components, dt);
        checkCollisions(components, dt);
    };
}
