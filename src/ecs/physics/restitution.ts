import type { Component } from "../component";
import type { Entity } from "../entity";

export class Restitution implements Component {
    constructor(public entity: Entity, public restitution: number) {}
}
