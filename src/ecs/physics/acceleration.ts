import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";

export class Acceleration implements Component {
    acc: Vector2D;

    constructor(public entity: Entity, x = 0, y = 0) {
        this.acc = [x, y];
    }
}
