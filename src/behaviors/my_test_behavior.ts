import { getComponent, type Component } from "../ecs/component";
import { type Entity } from "../ecs/entity";
import { BehaviorInterface } from "../ecs/primitive/behavior";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";

export class MyTestBehavior implements BehaviorInterface {
    position: Position | null = null;
    rotation: Rotation | null = null;

    firstTime = true;

    constructor(public entity: Entity) {}

    update(components: Component[], dt: number) {
        if (this.firstTime) {
            this.position = getComponent(this.entity, Position, components);
            this.rotation = getComponent(this.entity, Rotation, components);
            this.firstTime = false;
        }

        if (this.position && this.position.pos[0] > 71 + DIMENSIONS[0]) {
            this.position.pos[0] = -71;
        }

        if (this.rotation) this.rotation.angle += Math.PI * 0.5 * dt;
    }
}
