import { getComponent, type Component } from "../ecs/component";
import type { Entity } from "../ecs/entity";
import type { BehaviorInterface } from "../ecs/primitive/behavior";
import { Name } from "../ecs/primitive/name";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";

export class MyTestBehavior implements BehaviorInterface {
    init = true;
    position: Position | null = null;
    rotation: Rotation | null = null;

    constructor(public entity: Entity) {}

    update(components: Component[], dt: number) {
        if (this.init) {
            this.position = getComponent(this.entity, Position, components);
            this.rotation = getComponent(this.entity, Rotation, components);
            this.init = false;
        }

        if (this.position && this.position.pos[0] > 71 + DIMENSIONS[0]) this.position.pos[0] = -71;
        if (this.rotation) this.rotation.angle += Math.PI * 0.5 * dt;
    }

    onCollision(other: Entity, components: Component[]) {
        console.log(getComponent(other, Name, components)?.name);
    }
}
