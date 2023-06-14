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
        while (this.r > 255) this.r -= 255;
        while (this.g > 255) this.g -= 255;
        while (this.b > 255) this.b -= 255;
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
