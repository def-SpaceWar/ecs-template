import type { Component } from "../component";
import type { Entity } from "../entity";

export interface BehaviorConstructor {
    new (entity: Entity): BehaviorInterface;
};

export interface BehaviorInterface {
    entity: Entity;
    update: (components: Component[], dt: number) => void;
    onCollision?: (other: Entity, components: Component[]) => void;
};

export class Behavior implements Component {
    behavior: BehaviorInterface;

    constructor(
        public entity: Entity,
        BehaviorKind: BehaviorConstructor
    ) {
        this.behavior = new BehaviorKind(entity);
    }
}
