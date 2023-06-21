import type { Component } from "../component";
import type { Entity } from "../entity";
import { Vector, type Vector2D } from "../../util/vector";
import type { Polygon } from "../../util/collision";
import type { Position } from "../render/position";
import type { Rotation } from "../render/rotation";
import { ERROR_MARGIN } from "../../game";

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

export const getRectNormal = (r1: [Position, RectangleCollider], r2: [Position, RectangleCollider]): Vector2D => {
    const pos1 = Vector.add(r1[0].pos, r1[1].pos);
    const dims1 = r1[1].dims;
    const pos2 = Vector.add(r2[0].pos, r2[1].pos);
    const dims2 = r2[1].dims;
    
    if (pos1[1] + dims1[1] / 2 - ERROR_MARGIN < pos2[1] - dims2[1] / 2) {
        return [0, -1];
    } else if (pos1[1] - dims1[1] / 2 + ERROR_MARGIN > pos2[1] + dims2[1] / 2) {
        return [0, 1];
    } else if (pos1[0] + dims1[0] / 2 - ERROR_MARGIN < pos2[0] - dims2[0] / 2) {
        return [-1, 0];
    } else if (pos1[0] - dims1[0] / 2 + ERROR_MARGIN > pos2[0] + dims2[0] / 2) {
        return [1, 0];
    }

    // bogus!
    return Vector.random();
};
