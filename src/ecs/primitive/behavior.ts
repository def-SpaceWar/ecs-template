import type { Component } from "../component";
import type { Entity } from "../entity";

export type Behavior = {
    type: 'behavior';
    entity: Entity;
    behavior: (components: Component[], dt: number) => void;
};

export function behavior(
    entity: Entity,
    behavior: (components: Component[], dt: number) => void
): Behavior {
    return {
        type: 'behavior',
        entity,
        behavior
    };
}
