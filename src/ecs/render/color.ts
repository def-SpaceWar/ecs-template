import type { Component } from "../component";
import type { Entity } from "../entity";

export class Color implements Component {
    constructor(
        public entity: Entity,
        public r: number,
        public g: number,
        public b: number,
        public a = 1
    ) { }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
