import type { Entity } from "../entity";

export type Rotation = {
    type: 'rotation';
    entity: Entity;
    angle: number
};

export function rotation(
    entity: Entity,
    angle = 0
): Rotation {
    return {
        type: 'rotation',
        entity,
        angle
    };
}
