import type { Scalar, Vector2D } from "./vector";

export type Matrix2D = [Vector2D, Vector2D];

export namespace Matrix {
    export const det = (matrix: Matrix2D): Scalar =>
        matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}
