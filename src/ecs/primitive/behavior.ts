import type { Component } from "../component";
import type { Entity } from "../entity";

export class Behavior {
    constructor(
        public entity: Entity,
        public behavior: (components: Component[], dt: number) => void
    ) { }
}
