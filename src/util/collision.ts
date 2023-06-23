import { Restitution } from "../ecs/physics/restitution";
import { Velocity } from "../ecs/physics/velocity";
import { Position } from "../ecs/render/position";
import { type Vector2D } from "./vector";
import { Vector } from "./vector";
import { Mass } from "../ecs/physics/mass";

export type Polygon = Vector2D[];

export function arePolygonsColliding(p1: Polygon, p2: Polygon): boolean {
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

export function arePolygonAndLineColliding(polygon: Polygon, p1: Vector2D, p2: Vector2D): boolean {
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
): boolean {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
}

export function arePolygonAndPointColliding(polygon: Polygon, [px, py]: Vector2D): boolean {
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
    Mass?,
    Restitution?
];
/**
 * @param {Vector2D} normal - MUST BE NORMALIZED!
 */
export function resolveCollision(
    c1: CollisionInfo,
    c2: CollisionInfo,
    normal: Vector2D
): void {
    c1[0].pos = Vector.add(c1[0].pos, Vector.scale(normal, 0.5 / (c1[2]?.mass || 1)));
    c2[0].pos = Vector.add(c2[0].pos, Vector.scale(normal, -0.5 / (c2[2]?.mass || 1)));

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
    c1[1].vel = Vector.add(c1[1].vel, Vector.scale(jN, 1 / (c1[2]?.mass || 1)));
    c2[1].vel = Vector.add(c2[1].vel, Vector.scale(jN, -1 / (c2[2]?.mass || 1)));
};

export function linesCollisionPoint(
    [x1, y1]: Vector2D,
    [x2, y2]: Vector2D,
    [x3, y3]: Vector2D,
    [x4, y4]: Vector2D
): Vector2D {
    const slope1 = (y2 - y1) / (x2 - x1);
    if (slope1 == Infinity || slope1 == -Infinity) {
        const slope2 = (y4 - y3) / (x4 - x3);
        if (slope2 == Infinity || slope2 == -Infinity) return [Infinity, Infinity];
        const intercept2 = y3 - x3 * slope2;
        const x = x1;
        const y = x * slope2 + intercept2;
        return [x, y];
    }
    const intercept1 = y1 - x1 * slope1;
    const slope2 = (y4 - y3) / (x4 - x3);
    if (slope2 == Infinity || slope2 == -Infinity) {
        const x = x3;
        const y = x * slope1 + intercept1;
        return [x, y];
    }
    const intercept2 = y3 - x3 * slope2;
    const x = (intercept2 - intercept1) / (slope1 - slope2);
    const y = x * slope1 + intercept1;
    return [x, y];
}


export function normalOfCollision(
    o1: [Position, Polygon],
    o2: [Position, Polygon]
): Vector2D {
    const overlap: Polygon = [];
    const c1 = o1[0].pos;
    const p1 = o1[1];
    const c2 = o2[0].pos;
    const p2 = o2[1];

    for (let current1 = 0; current1 < p1.length; current1++) {
        let next = current1 + 1;
        if (next == p1.length) next = 0;

        const vc1 = p1[current1];
        const vn1 = p1[next];

        for (let current2 = 0; current2 < p2.length; current2++) {
            let next2 = current2 + 1;
            if (next2 == p2.length) next2 = 0;

            const vc2 = p2[current2];
            const vn2 = p2[next2];

            if (!areLinesColliding(vc1, vn1, vc2, vn2)) continue;
            const intersection = linesCollisionPoint(vc1, vn1, vc2, vn2);
            overlap.push(intersection);
        }
    }

    return Vector.normalize(Vector.snap(
        Vector.subtract(c2, c1),
        Vector.normal(Vector.subtract(
            overlap[0],
            overlap[overlap.length - 1]
        )),
        Vector.normal(Vector.subtract(
            overlap[overlap.length - 1],
            overlap[0]
        ))
    ));
}

export function pointOfCollision(
    p1: Polygon,
    p2: Polygon
): Vector2D {
    let total: Vector2D = Vector.zero();

    for (let current1 = 0; current1 < p1.length; current1++) {
        let next = current1 + 1;
        if (next == p1.length) next = 0;

        const vc1 = p1[current1];
        const vn1 = p1[next];

        for (let current2 = 0; current2 < p2.length; current2++) {
            let next2 = current2 + 1;
            if (next2 == p2.length) next2 = 0;

            const vc2 = p2[current2];
            const vn2 = p2[next2];

            if (!areLinesColliding(vc1, vn1, vc2, vn2)) continue;
            const intersection = linesCollisionPoint(vc1, vn1, vc2, vn2);
            total = Vector.add(total, intersection);
        }
    }

    return Vector.scale(total, 1 / total.length);
}
