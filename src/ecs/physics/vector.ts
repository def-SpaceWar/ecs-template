export type Vector2D = [number, number];
export type Scalar = number;

export const scale = (v: Vector2D, s: Scalar): Vector2D =>
    v.map(n => n * s) as Vector2D;

export const dot = (a: Vector2D, b: Vector2D): Scalar =>
    a.reduce((p, v, i) => p + v * b[i], 0);

export const magnitudeSquared = (v: Vector2D): Scalar =>
    dot(v, v);

export const magnitude = (v: Vector2D): Scalar =>
    Math.sqrt(magnitudeSquared(v));

export const normalize = (v: Vector2D): Vector2D =>
    (v[0] == 0 && v[1] == 0) ? normalize([Math.random(), Math.random()])
        : scale(v, 1 / magnitude(v));

export const add = (v1: Vector2D, v2: Vector2D): Vector2D =>
    [v1[0] + v2[0], v1[1] + v2[1]];

export const subtract = (v1: Vector2D, v2: Vector2D): Vector2D =>
    [v1[0] - v2[0], v1[1] - v2[1]];

export const rotate = (v: Vector2D, angle: number, origin: Vector2D = [0, 0]): Vector2D => {
    const difference = subtract(v, origin);
    return add([
        Math.cos(angle) * difference[0] - Math.sin(angle) * difference[1],
        Math.sin(angle) * difference[0] + Math.cos(angle) * difference[1]
    ], origin)
};
