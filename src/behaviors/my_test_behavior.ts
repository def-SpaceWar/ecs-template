import { getComponent, type Component } from "../ecs/component";
import type { Entity } from "../ecs/entity";
import { BehaviorClass, type BehaviorInterface } from "../ecs/primitive/behavior";
import { Name } from "../ecs/primitive/name";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";

export class MyTestBehavior extends BehaviorClass implements BehaviorInterface {
    position: Position;
    rotation: Rotation;

    start(components: Component[]): void {
        this.position = getComponent(this.entity, Position, components)!;
        this.rotation = getComponent(this.entity, Rotation, components)!;
    }

    update(_components: Component[], dt: number) {
        this.rotation.angle += Math.PI * 0.5 * dt;
        if (this.position.pos[0] > 71 + DIMENSIONS[0]) this.position.pos[0] = -71;
    }

    onCollision(other: Entity, components: Component[], _dt: number) {
        console.log(getComponent(other, Name, components)?.name);
    }
}
