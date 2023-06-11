import type { Entity } from "../entity";
import type { Vector2D } from "../physics/vector";

export type Rectangle = {
    type: 'rectangle';
    entity: Entity;
    pos: Vector2D;
    dims: Vector2D;
};

export function rectangle(
    entity: Entity,
    pos: Vector2D,
    dims: Vector2D
): Rectangle {
    return {
        type: 'rectangle',
        entity,
        pos,
        dims
    };
}
