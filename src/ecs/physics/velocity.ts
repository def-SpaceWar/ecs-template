import type { Entity } from "../entity";
import type { Vector2D } from "../physics/vector";

export type Velocity = {
    type: 'velocity';
    entity: Entity;
    vel: Vector2D;
};

export function velocity(entity: Entity, x: number, y: number): Velocity;
export function velocity(
    entity: Entity,
    ...vel: Vector2D
): Velocity {
    return {
        type: 'velocity',
        entity,
        vel
    };
}
