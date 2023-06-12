import type { Entity } from "../entity";

export class Rotation {
    constructor(public entity: Entity, public angle = 0) {}
}
