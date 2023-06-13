import type { Component } from "../component";
import type { Entity } from "../entity";

export interface BehaviorClass {
    update: (components: Component[], dt: number) => void;
};

export class Behavior {
    behavior: BehaviorClass;

    constructor(
        public entity: Entity,
        BehaviorKind: new (entity: Entity) => BehaviorClass
    ) {
        this.behavior = new BehaviorKind(entity);
    }
}
