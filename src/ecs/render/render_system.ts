import type { System } from "../system";
import { type Vector2D, Vector } from "../../util/vector";
import { Color } from "./color";
import { Position } from "../render/position";
import { Rotation } from "./rotation";
import { Rectangle } from "./rectangle";
import type { Scene } from "../../util/scene_manager";
import { getComponent, getComponents, isComponent } from "../component";
import type { Entity } from "../entity";
import { Circle } from "./circle";
import { Ellipse } from "./ellipse";
import { Tag } from "../primitive/tag";

export const DIMENSIONS: Vector2D = [0, 0];

const draw = (e: Entity, ctx: CanvasRenderingContext2D, cameraPos: Vector2D) => {
    const shapes = [
        ...getComponents(e, Rectangle),
        ...getComponents(e, Circle),
        ...getComponents(e, Ellipse),
    ];
    if (!shapes[0]) return;

    const position = getComponent(e, Position);
    const pos: Vector2D = position ? position.pos : [0, 0];
    const isWorldSpace = position?.isWorldSpace || false;

    const color = getComponent(e, Color);
    const fillStyle = color ? color.toString() : 'black';

    const rotation = getComponent(e, Rotation);
    const angle = rotation ? rotation.angle : 0;

    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.translate(...pos);
    if (isWorldSpace) {
        ctx.translate(DIMENSIONS[0] / 2, DIMENSIONS[1] / 2);
        ctx.translate(...Vector.scale(cameraPos, -1));
    }
    ctx.rotate(angle);
    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        ctx.save();
        if (isComponent(Rectangle, shape)) {
            ctx.translate(...Vector.scale(shape.dims, -0.5));
            ctx.fillRect(...shape.pos, ...shape.dims);
        }
        if (isComponent(Circle, shape)) {
            ctx.beginPath();
            ctx.arc(...shape.pos, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        if (isComponent(Ellipse, shape)) {
            ctx.beginPath();
            ctx.ellipse(...shape.pos, ...shape.dims, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    ctx.restore();
}

export function createRenderSystem(dynamic = true, w = 800, h = 800): System {
    const ctx = document.getElementById('app')!.appendChild(
        document.createElement('canvas')
    ).getContext('2d')!;

    DIMENSIONS[0] = ctx.canvas.width = w;
    DIMENSIONS[1] = ctx.canvas.height = h;

    if (dynamic) {
        DIMENSIONS[0] = ctx.canvas.width = window.innerWidth;
        DIMENSIONS[1] = ctx.canvas.height = window.innerHeight;
        addEventListener('resize', () => {
            DIMENSIONS[0] = ctx.canvas.width = window.innerWidth;
            DIMENSIONS[1] = ctx.canvas.height = window.innerHeight;
        });
    }

    const fpsText = document.getElementById('app')!.appendChild(
        document.createElement('p')
    );
    fpsText.id = "fps";

    const fpsCounts: number[] = [];
    const average = () => {
        if (fpsCounts.length > 25) fpsCounts.shift();
        const total = fpsCounts.reduce((p, v) => v + p, 0);
        return Math.floor(total / fpsCounts.length);
    },
        max = () => Math.floor(Math.max(...fpsCounts)),
        min = () => Math.floor(Math.min(...fpsCounts));

    let cameraPos: Vector2D = Vector.zero();
    const lerpConstant = 6;

    return (scene: Scene, dt: number) => {
        fpsCounts.push(1 / dt);
        fpsText.innerText = `FPS: ${average()}; [${min()}, ${max()}]`;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let center: Vector2D = Vector.zero();
        let centeredEntities = 0;

        for (let e = 0; e < scene.totalEntities(); e++) {
            const tags = getComponents(e, Tag);
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].tag != "CameraCenter") continue;
                const pos = getComponent(e, Position);
                if (!pos) continue;
                center = Vector.add(center, pos.pos);
                centeredEntities++;
            }
        }

        center = Vector.scale(center, 1 / centeredEntities);
        cameraPos = Vector.add(
            Vector.scale(cameraPos, 1 - dt * lerpConstant),
            Vector.scale(center, dt * lerpConstant)
        )

        for (let e = 0; e < scene.totalEntities(); e++) {
            draw(e, ctx, cameraPos);
        }
    };
}
