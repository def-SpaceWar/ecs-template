import type { Component } from "../component";
import type { Entity } from "../entity";

export class Name implements Component {
    constructor(public entity: Entity, public name: string) {}
}
