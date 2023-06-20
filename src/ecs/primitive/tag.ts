import type { Component } from "../component";
import type { Entity } from "../entity";

export class Tag implements Component {
    constructor(public entity: Entity, public tag: string) {}
}
