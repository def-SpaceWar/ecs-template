import { getComponent, type Component } from "../ecs/component";
import type { Entity } from "../ecs/entity";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Name } from "../ecs/primitive/name";
import { Color } from "../ecs/render/color";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";

export class MyTestBehavior extends BehaviorClass {
    position: Position;
    rotation: Rotation;
    color: Color;

    start(components: Component[]): void {
        this.position = getComponent(this.entity, Position, components)!;
        this.rotation = getComponent(this.entity, Rotation, components)!;
        this.color = getComponent(this.entity, Color, components)!;
    }

    update(_components: Component[], dt: number) {
        this.rotation.angle += Math.PI * 0.5 * dt;
        if (this.position.pos[0] > 71 + DIMENSIONS[0]) this.position.pos[0] = -71;
    }

    onCollision(other: Entity, components: Component[], dt: number) {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                this.color.r += 255 * dt;
                break;
            case 1:
                this.color.g += 255 * dt;
                break;
            case 2:
                this.color.b += 255 * dt;
                break;
        }

        console.log(getComponent(other, Name, components)?.name);
    }
}
