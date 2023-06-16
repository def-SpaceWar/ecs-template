import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";

export class Position implements Component {
    pos: Vector2D;

    constructor(public entity: Entity, x: number, y: number, public isWorldSpace = true) {
        this.pos = [x, y];
    }
}
