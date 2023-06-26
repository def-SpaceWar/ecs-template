import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";
import type { ColorRGBA } from "../../util/color";

export class Ellipse implements Component {
    pos: Vector2D;
    dims: Vector2D;

    constructor(public entity: Entity, x: number, y: number, w: number, h: number, public color: ColorRGBA) {
        this.pos = [x, y];
        this.dims = [w, h];
    }
}
