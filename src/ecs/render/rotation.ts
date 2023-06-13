import type { Component } from "../component";
import type { Entity } from "../entity";

export class Rotation implements Component {
    constructor(public entity: Entity, public angle = 0) {}
}
