import type { Component } from "../component";
import type { Entity } from "../entity";

export class RotationalVelocity implements Component {
    constructor(public entity: Entity, public vel = 0) {}
}
