/**
 * r -> 0 - 255
 * b -> 0 - 255
 * g -> 0 - 255
 * a -> 0 - 1
 */
export type ColorRGBA = [r: number, g: number, b: number, a?: number];

export namespace Color {
    export const toString = (c: ColorRGBA): string =>
        `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3] ? c[3] : 1})`;
}
