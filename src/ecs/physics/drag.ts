import type { Component } from "../component";
import type { Entity } from "../entity";

export class Drag implements Component {
    constructor(public entity: Entity, public drag = 1) { }
}
