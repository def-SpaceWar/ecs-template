import type { Component } from "../component";
import type { Entity } from "../entity";
import { Vector, type Vector2D } from "../../util/vector";
import type { Polygon } from "../../util/collision";
import type { Position } from "../render/position";
import { Rotation } from "../render/rotation";

export class EllipseCollider implements Component {
    pos: Vector2D;
    dims: Vector2D;

    constructor(public entity: Entity, x: number, y: number, w: number, h: number) {
        this.pos = [x, y];
        this.dims = [w, h];
    }
}

export type EllipseInfo = [
    Position,
    EllipseCollider,
    Rotation?
];

export const getEllipsePoints = (e: EllipseInfo): Polygon => {
    const center = Vector.add(e[0].pos, e[1].pos);
    const points: Polygon = [];

    for (let i = 0; i < 200; i++) {
        const angle = i * Math.PI / 100;
        points.push([Math.cos(angle), Math.sin(angle)]);
    }

    return points.map(p => [p[0] * e[1].dims[0], p[1] * e[1].dims[1]] as Vector2D)
        .map(p => Vector.rotate(p, e[2] ? e[2].angle : 0))
        .map(p => Vector.add(p, center));
};
