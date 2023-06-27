import type { Component } from "../component";
import type { Entity } from "../entity";

export class RotationalResistence implements Component {
    constructor(public entity: Entity, public resistence = 1) { }
}
