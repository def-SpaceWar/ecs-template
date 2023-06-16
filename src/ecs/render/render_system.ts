import type { System } from "../system";
import { type Vector2D, Vector } from "../../util/vector";
import { Color } from "./color";
import { Position } from "../render/position";
import { Rotation } from "./rotation";
import { Rectangle } from "./rectangle";
import { type Scene } from "../../util/scene_manager";
import { HEIGHT, WIDTH } from "../../main";
import { getComponent, getComponents } from "../component";

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

    return (scene: Scene, _dt: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let e = 0; e < scene.totalEntities(); e++) {
            const rects = getComponents(e, Rectangle, scene.components);
            if (!rects[0]) continue;

            const position = getComponent(e, Position, scene.components);
            const pos: Vector2D = position ? position.pos : [0, 0];
            const isWorldSpace = position?.isWorldSpace || false;

            const color = getComponent(e, Color, scene.components);
            const fillStyle = color ? color.toString() : 'black';

            const rotation = getComponent(e, Rotation, scene.components);
            const angle = rotation ? rotation.angle : 0;

            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.translate(...pos);
            if (isWorldSpace) {
                ctx.translate(WIDTH / 2, HEIGHT / 2)
                const cameraPos: Vector2D = [400, 400];
                ctx.translate(...Vector.scale(cameraPos, -1));
            }
            ctx.rotate(angle);
            for (let i = 0; i < rects.length; i++) {
                ctx.save();
                ctx.translate(...Vector.scale(rects[i].dims, -0.5));
                ctx.fillRect(...rects[i].pos, ...rects[i].dims);
                ctx.restore();
            }
            ctx.restore();
        }
    };
}
