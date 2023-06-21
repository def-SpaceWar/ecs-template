import type { Component } from "../component";
import type { Entity } from "../entity";
import { Vector, type Vector2D } from "../../util/vector";
import type { Polygon } from "../../util/collision";
import type { Position } from "../render/position";
import type { Rotation } from "../render/rotation";

export class RectangleCollider implements Component {
    pos: Vector2D;
    dims: Vector2D;

    constructor(public entity: Entity, x: number, y: number, w: number, h: number) {
        this.pos = [x, y];
        this.dims = [w, h];
    }
}

export type RectInfo = [
    Position,
    RectangleCollider,
    Rotation?
];

export const getRectPoints = (r: RectInfo): Polygon => {
    const angle = r[2]?.angle || 0;
    const rectCenter = Vector.add(r[0].pos, r[1].pos);
    return [
        Vector.rotate(Vector.add(rectCenter, Vector.scale(r[1].dims, 0.5)), angle, r[0].pos),
        Vector.rotate(Vector.add(rectCenter, Vector.scale([-r[1].dims[0], r[1].dims[1]], 0.5)), angle, r[0].pos),
        Vector.rotate(Vector.add(rectCenter, Vector.scale(r[1].dims, -0.5)), angle, r[0].pos),
        Vector.rotate(Vector.add(rectCenter, Vector.scale([r[1].dims[0], -r[1].dims[1]], 0.5)), angle, r[0].pos)
    ];
};
