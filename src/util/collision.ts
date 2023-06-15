import { Vector, Vector2D } from "./vector";

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

export function polygonCollisionResolution(c1: Vector2D, p1: Polygon, c2: Vector2D, p2: Polygon) {
    let poly1 = p1;
    let center1 = c1;
    let poly2 = p2;
    let center2 = c2;

    let totalDisplacement = Vector.zero();

    for (let shape = 0; shape < 2; shape++) {
        if (shape == 1) {
            poly1 = p2;
            center1 = c2;
            poly2 = p1;
            center2 = c2;
        }

        for (let p = 0; p < poly1.length; p++) {
            const line_r1s = center1;
            const line_r1e = poly1[p];

            for (let q = 0; q < poly2.length; q++) {
                const line_r2s = poly2[q];
                const line_r2e = poly2[(q + 1) % poly2.length];

                const h = (line_r2e[0] - line_r2s[0]) * (line_r1s[1] - line_r1e[1]) - (line_r1s[0] - line_r1e[0]) * (line_r2e[1] - line_r2s[1]);
                const t1 = ((line_r2s[1] - line_r2e[1]) * (line_r1s[0] - line_r2s[0]) + (line_r2e[0] - line_r2s[0]) * (line_r1s[1] - line_r2s[1])) / h;
                const t2 = ((line_r1s[1] - line_r1e[1]) * (line_r1s[0] - line_r2s[0]) + (line_r1e[0] - line_r1s[0]) * (line_r1s[1] - line_r2s[1])) / h;

                if (t1 >= 0.0 && t1 < 1.0 && t2 >= 0.0 && t2 < 1.0) {
                    totalDisplacement = Vector.add(Vector.scale(Vector.subtract(line_r1e, line_r1s), (1 - t1) * (shape == 0 ? -1 : +1)), totalDisplacement);
                }
            }
        }
    }

    return totalDisplacement;
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
