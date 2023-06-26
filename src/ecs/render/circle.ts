import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Vector2D } from "../../util/vector";
import type { ColorRGBA } from "../../util/color";

export class Circle implements Component {
    pos: Vector2D;

    constructor(public entity: Entity, x: number, y: number, public radius: number, public color: ColorRGBA) {
        this.pos = [x, y];
    }
}
