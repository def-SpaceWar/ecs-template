import type { System } from "../system";
import { type Vector2D, Vector } from "../../util/vector";
import { Position } from "../render/position";
import { Rotation } from "./rotation";
import { Rectangle } from "./rectangle";
import type { Scene } from "../../util/scene_manager";
import { type Component, getComponent, getComponents, findComponentsOfTypes, isComponent } from "../component";
import { Circle } from "./circle";
import { Ellipse } from "./ellipse";
import { Tag } from "../primitive/tag";
import { Color } from "../../util/color";

export const DIMENSIONS: Vector2D = [0, 0];

export function createRenderSystem(cameraSpeed: number, dynamic: boolean, w: number, h: number): System {
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

    let cameraPos: Vector2D = Vector.zero();
    return (scene: Scene, dt: number) => {
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
        const camSpeed = Vector.scale(
            Vector.subtract(center, cameraPos),
            dt * cameraSpeed
        );
        cameraPos = Vector.add(
            cameraPos,
            camSpeed
        );

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const shapes = findComponentsOfTypes<Component>([
            Rectangle,
            Circle,
            Ellipse
        ]);
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            const position = getComponent(shape.entity, Position);
            const pos: Vector2D = position ? position.pos : [0, 0];
            const isWorldSpace = position?.isWorldSpace || false;

            const rotation = getComponent(shape.entity, Rotation);
            const angle = rotation ? rotation.angle : 0;

            ctx.save();
            ctx.translate(DIMENSIONS[0] / 2, DIMENSIONS[1] / 2);
            if (isWorldSpace) {
                ctx.translate(...Vector.scale(cameraPos, -1));
            }
            ctx.translate(...pos);
            ctx.rotate(angle);
            if (isComponent(Rectangle, shape)) {
                ctx.fillStyle = Color.toString(shape.color);
                ctx.translate(...Vector.scale(shape.dims, -0.5));
                ctx.fillRect(...shape.pos, ...shape.dims);
            } else if (isComponent(Circle, shape)) {
                ctx.fillStyle = Color.toString(shape.color);
                ctx.beginPath();
                ctx.arc(...shape.pos, shape.radius, 0, 2 * Math.PI);
                ctx.fill();
            } else if (isComponent(Ellipse, shape)) {
                ctx.fillStyle = Color.toString(shape.color);
                ctx.beginPath();
                ctx.ellipse(...shape.pos, ...shape.dims, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    };
}
