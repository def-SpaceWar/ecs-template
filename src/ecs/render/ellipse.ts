import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";

export class Ellipse implements Component {
    pos: Vector2D;
    dims: Vector2D;

    constructor(public entity: Entity, x: number, y: number, w: number, h: number) {
        this.pos = [x, y];
        this.dims = [w, h];
    }
}
