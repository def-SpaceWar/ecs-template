import type { Entity } from "../entity";
import type { Vector2D } from "../physics/vector";

export type Position = {
    type: 'position';
    entity: Entity;
    pos: Vector2D;
};

export function position(entity: Entity, x: number, y: number): Position;
export function position(
    entity: Entity,
    ...pos: Vector2D
): Position {
    return {
        type: 'position',
        entity,
        pos
    };
}
