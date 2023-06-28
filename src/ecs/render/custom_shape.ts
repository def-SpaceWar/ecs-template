import type { Polygon } from "../../util/collision";
import type { ColorRGBA } from "../../util/color";
import { type Vector2D, Vector } from "../../util/vector";
import type { Component } from "../component";
import type { Entity } from "../entity";

export class CustomShape implements Component {
    pos: Vector2D;

    constructor(public entity: Entity, x: number, y: number, public points: Polygon, public color: ColorRGBA) {
        this.pos = [x, y];

        let sum: Vector2D = [0, 0];
        for (const point of this.points) {
            sum = Vector.add(sum, point);
        }

        const midPoint = Vector.scale(sum, 1 / points.length);
        for (let i = 0; i < this.points.length; i++) {
            this.points[i] = Vector.subtract(this.points[i], midPoint);
        }
    }
}
