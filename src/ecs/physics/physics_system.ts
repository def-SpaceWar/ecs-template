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
    Rotation | null
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
const isRectsColliding = (r1: RectInfo, r2: RectInfo) =>
    arePolygonsColliding(getRectPoints(r1), getRectPoints(r2));

export function createPhysicsSystem(): System {
    return (components: Component[], dt: number) => {
        for (let e = 0; e < totalEntities(); e++) {
            const velocity = getComponent(e, Velocity, components);
            if (velocity) {
                const position = getComponent(e, Position, components);
                if (position) {
                    position.pos = add(position.pos, scale(velocity.vel, dt));
                }
            }
        }

        for (let e1 = 0; e1 < totalEntities(); e1++) {
            const position1 = getComponent(e1, Position, components);
            const rotation1 = getComponent(e1, Rotation, components);
            const rectCollider1 = getComponent(e1, RectangleCollider, components);
            if (position1 && rectCollider1) {
                for (let e2 = e1 + 1; e2 < totalEntities(); e2++) {
                    const position2 = getComponent(e2, Position, components);
                    const rotation2 = getComponent(e2, Rotation, components);
                    const rectCollider2 = getComponent(e2, RectangleCollider, components);
                    if (position2 && rectCollider2) {
                        if (
                            isRectsColliding([
                                position1,
                                rectCollider1,
                                rotation1
                            ], [
                                position2,
                                rectCollider2,
                                rotation2
                            ])) {
                            const behaviors1 = getComponents(e1, Behavior, components);
                            const behaviors2 = getComponents(e2, Behavior, components)

                            behaviors1.forEach(b => {
                                if (b.behavior.onCollision) {
                                    b.behavior.onCollision(e2, components);
                                }
                            });

                            behaviors2.forEach(b => {
                                if (b.behavior.onCollision) {
                                    b.behavior.onCollision(e1, components);
                                }
                            });
                        }
                    }
                }
            }
        }
    };
}
