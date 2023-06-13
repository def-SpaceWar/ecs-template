import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";

export class Velocity implements Component {
    vel: Vector2D;

    constructor(public entity: Entity, x: number, y: number) {
        this.vel = [x, y];
    }
}
