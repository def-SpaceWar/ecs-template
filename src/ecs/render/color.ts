import type { Entity } from "../entity";

export type Color = {
    type: 'color';
    entity: Entity;
    r: number,
    b: number,
    g: number,
    a: number
};

export const colorToString = (color: Color) =>
    `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

export function color(
    entity: Entity,
    r: number,
    g: number,
    b: number,
    a: number = 1
): Color {
    return {
        type: 'color',
        entity,
        r,
        g,
        b,
        a
    };
}
