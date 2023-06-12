import type { Entity } from "../entity";
import type { Vector2D } from "../physics/vector";

export class Velocity {
    vel: Vector2D;

    constructor(public entity: Entity, x: number, y: number) {
        this.vel = [x, y];
    }
}
