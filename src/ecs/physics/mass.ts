import type { Component } from "../component";
import type { Entity } from "../entity";

export class Mass implements Component {
    constructor(public entity: Entity, public mass: number) {}
}
