import type { System } from "../system";
import { type Vector2D, scale } from "../physics/vector";
import { type Component, getComponent } from "../component";
import { totalEntities } from "../entity";
import { colorToString } from "./color";

export function createRenderSystem(dynamic = true, w = 800, h = 800): System {
    const ctx = document.getElementById('app')!.appendChild(
        document.createElement('canvas')
    ).getContext('2d')!;

    if (!dynamic) {
        ctx.canvas.width = w;
        ctx.canvas.height = h;
    } else {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        addEventListener('resize', () => {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        });
    }

    return (components: Component[], _dt: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let e = 0; e < totalEntities(); e++) {
            const rect = getComponent(e, 'rectangle', components);

            if (rect) {
                const position = getComponent(e, 'position', components);
                const pos: Vector2D = position ? position.pos : [0, 0];

                const color = getComponent(e, 'color', components);
                const fillStyle = color ? colorToString(color) : 'black';

                const rotation = getComponent(e, 'rotation', components);
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
