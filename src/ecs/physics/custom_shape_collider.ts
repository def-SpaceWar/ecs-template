import type { Polygon } from "../../util/collision";
import { Vector, type Vector2D } from "../../util/vector";
import type { Component } from "../component";
import type { Entity } from "../entity";
import type { Position } from "../render/position";
import type { Rotation } from "../render/rotation";

export class CustomShapeCollider implements Component {
    pos: Vector2D;

    constructor(
        public entity: Entity,
        x: number, y: number,
        public points: Polygon
    ) {
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

export type CustomShapeInfo = [
    Position,
    CustomShapeCollider,
    Rotation?
];

export const getCustomShapePoints = (shape: CustomShapeInfo): Polygon => {
    const angle = shape[2]?.angle || 0;
    const center = Vector.add(shape[0].pos, shape[1].pos);
    const points: Polygon = [];

    for (const point of shape[1].points) {
        points.push(
            Vector.add(Vector.rotate(point, angle), center)
        );
    }

    return points;
};
