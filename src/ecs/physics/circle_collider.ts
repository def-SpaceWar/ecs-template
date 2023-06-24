import type { Component } from "../component";
import type { Entity } from "../entity";
import { Vector, type Vector2D } from "../../util/vector";
import type { Polygon } from "../../util/collision";
import type { Position } from "../render/position";

export class CircleCollider implements Component {
    pos: Vector2D;

    constructor(public entity: Entity, x: number, y: number, public radius: number) {
        this.pos = [x, y];
    }
}

export type CircleInfo = [
    Position,
    CircleCollider
];

export const getCirclePoints = (c: CircleInfo): Polygon => {
    const center = Vector.add(c[0].pos, c[1].pos);
    const points: Polygon = [];
    const radiusLine = Vector.add([0, c[1].radius], center);

    for (let i = 0; i < 200; i++) {
        const angle = i * Math.PI / 100;
        points.push(Vector.rotate(radiusLine, angle, center));
    }

    return points;
};
