import type { Vector2D } from "./vector";

export function arePolygonsColliding(p1: Vector2D[], p2: Vector2D[]) {
    let next = 0;
    for (let current = 0; current < p1.length; current++) {
        next = current + 1;
        if (next == p1.length) next = 0;

        const vc = p1[current];
        const vn = p1[next];

        if (arePolygonAndLineColliding(p2, vc[0], vc[1], vn[0], vn[1])) return true;
        if (arePolygonAndPointColliding(p1, p2[0][0], p2[0][1])) return true;
    }

    return false;
};


export function arePolygonAndLineColliding(vertices: Vector2D[], x1: number, y1: number, x2: number, y2: number) {
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {
        next = current + 1;
        if (next == vertices.length) next = 0;

        const x3 = vertices[current][0];
        const y3 = vertices[current][1];
        const x4 = vertices[next][0];
        const y4 = vertices[next][1];
        if (areLinesColliding(x1, y1, x2, y2, x3, y3, x4, y4)) return true;
    }

    return false;
}


export function areLinesColliding(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
}


export function arePolygonAndPointColliding(vertices: Vector2D[], px: number, py: number) {
    let collision = false;

    let next = 0;
    for (let current = 0; current < vertices.length; current++) {
        next = current + 1;
        if (next == vertices.length) next = 0;

        const vc = vertices[current];
        const vn = vertices[next];
        if (((vc[1] > py && vn[1] < py) || (vc[1] < py && vn[1] > py)) &&
            (px < (vn[0] - vc[0]) * (py - vc[1]) / (vn[1] - vc[1]) + vc[0])) {
            collision = !collision;
        }
    }

    return collision;
}
