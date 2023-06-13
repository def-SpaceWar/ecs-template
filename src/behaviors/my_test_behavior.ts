import { getComponent, type Component } from "../ecs/component";
import { type Entity } from "../ecs/entity";
import { BehaviorInterface } from "../ecs/primitive/behavior";
import { Position } from "../ecs/primitive/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";

export class MyTestBehavior implements BehaviorInterface {
    constructor(public entity: Entity) { }

    update(components: Component[], dt: number) {
        const position = getComponent(this.entity, Position, components);
        if (position && position.pos[0] > 71 + DIMENSIONS[0]) {
            position.pos[0] = -71;
        }

        const rotation = getComponent(this.entity, Rotation, components);
        if (rotation) rotation.angle += Math.PI * 0.5 * dt;
    }
}
