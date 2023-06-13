import type { System } from "../system";
import { type Vector2D, scale } from "../../util/vector";
import { type Component, getComponent } from "../component";
import { totalEntities } from "../entity";
import { Color } from "./color";
import { Position } from "../render/position";
import { Rotation } from "./rotation";
import { Rectangle } from "./rectangle";

export const DIMENSIONS: Vector2D = [0, 0];

export function createRenderSystem(dynamic = true, w = 800, h = 800): System {
    const ctx = document.getElementById('app')!.appendChild(
        document.createElement('canvas')
    ).getContext('2d')!;

    if (!dynamic) {
        DIMENSIONS[0] = ctx.canvas.width = w;
        DIMENSIONS[1] = ctx.canvas.height = h;
    } else {
        DIMENSIONS[0] = ctx.canvas.width = window.innerWidth;
        DIMENSIONS[1] = ctx.canvas.height = window.innerHeight;
        addEventListener('resize', () => {
            DIMENSIONS[0] = ctx.canvas.width = window.innerWidth;
            DIMENSIONS[1] = ctx.canvas.height = window.innerHeight;
        });
    }

    return (components: Component[], _dt: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let e = 0; e < totalEntities(); e++) {
            const rect = getComponent(e, Rectangle, components);

            if (rect) {
                const position = getComponent(e, Position, components);
                const pos: Vector2D = position ? position.pos : [0, 0];

                const color = getComponent(e, Color, components);
                const fillStyle = color ? color.toString() : 'black';

                const rotation = getComponent(e, Rotation, components);
                const angle = rotation ? rotation.angle : 0;

                //const isCamera = !!getComponent(e, 'isCamera', components);

                ctx.save();
                // if (isCamera) ctx.translate(...'findthecamerasomehow'.pos);
                ctx.translate(...pos);
                ctx.rotate(angle);
                ctx.fillStyle = fillStyle;
                ctx.translate(...scale(rect.dims, -0.5));
                ctx.fillRect(...rect.pos, ...rect.dims);
                ctx.restore();
            }
        }
    };
}
