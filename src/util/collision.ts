import { Restitution } from "../ecs/physics/restitution";
import { Velocity } from "../ecs/physics/velocity";
import { Position } from "../ecs/render/position";
import { type Vector2D } from "./vector";
import { Vector } from "./vector";
import { Mass } from "../ecs/physics/mass";

export type Polygon = Vector2D[];

export function arePolygonsColliding(p1: Polygon, p2: Polygon) {
    let next = 0;
    for (let current = 0; current < p1.length; current++) {
        next = current + 1;
        if (next == p1.length) next = 0;

        const vc = p1[current];
        const vn = p1[next];

        if (arePolygonAndLineColliding(p2, vc, vn)) return true;
        if (arePolygonAndPointColliding(p1, p2[0])) return true;
    }

    return false;
}

export function arePolygonAndLineColliding(polygon: Polygon, p1: Vector2D, p2: Vector2D) {
    let next = 0;
    for (let current = 0; current < polygon.length; current++) {
        next = current + 1;
        if (next == polygon.length) next = 0;

        const p3 = polygon[current];
        const p4 = polygon[next];
        if (areLinesColliding(p1, p2, p3, p4)) return true;
    }

    return false;
}

export function areLinesColliding(
    [x1, y1]: Vector2D,
    [x2, y2]: Vector2D,
    [x3, y3]: Vector2D,
    [x4, y4]: Vector2D
) {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
}

export function arePolygonAndPointColliding(polygon: Polygon, [px, py]: Vector2D) {
    let collision = false;

    let next = 0;
    for (let current = 0; current < polygon.length; current++) {
        next = current + 1;
        if (next == polygon.length) next = 0;

        const vc = polygon[current];
        const vn = polygon[next];
        if (((vc[1] > py && vn[1] < py) || (vc[1] < py && vn[1] > py)) &&
            (px < (vn[0] - vc[0]) * (py - vc[1]) / (vn[1] - vc[1]) + vc[0])) {
            collision = !collision;
        }
    }

    return collision;
}

export type CollisionInfo = [
    Position,
    Velocity,
    Mass?, // by default 1
    Restitution? // by default fully elastic
];
/**
 * @param {Vector2D} normal - MUST BE NORMALIZED!
 */
export const collisionResolution = (c1: CollisionInfo, c2: CollisionInfo, normal: Vector2D) => {
    c1[0].pos = Vector.add(c1[0].pos, Vector.scale(normal, 0.5/(c1[2]?.mass || 1)));
    c2[0].pos = Vector.add(c2[0].pos, Vector.scale(normal, -0.5/(c2[2]?.mass || 1)));

    const collisionRestitution = Math.min(
        c1[3] ? c1[3].restitution : 1,
        c2[3] ? c2[3].restitution : 1
    );
    const relativeVelocity = Vector.subtract(
        c1[1].vel,
        c2[1].vel
    );

    const invertedMasses = (1 / (c1[2]?.mass || 1)) + (1 / (c2[2]?.mass || 1));
    const impulseMagnitude = -(1 + collisionRestitution)
        * Vector.dot(relativeVelocity, normal)
        / invertedMasses;

    const jN = Vector.scale(normal, impulseMagnitude);
    c1[1].vel = Vector.add(c1[1].vel, Vector.scale(jN, 1/(c1[2]?.mass || 1)));
    c2[1].vel = Vector.add(c2[1].vel, Vector.scale(jN, -1/(c2[2]?.mass || 1)));
};
