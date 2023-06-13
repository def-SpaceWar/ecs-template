import type { Entity } from "../entity";
import type { Vector2D } from "../physics/vector";

export class Position {
    pos: Vector2D;

    constructor(public entity: Entity, x: number, y: number) {
        this.pos = [x, y];
    }
}
