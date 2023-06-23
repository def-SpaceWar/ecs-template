import { getComponent } from "../ecs/component";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Rotation } from "../ecs/render/rotation";

export class Rotate extends BehaviorClass {
    rotation: Rotation;
    speed = 0.5;

    start(): void {
        this.rotation = getComponent(this.entity, Rotation)!;
    }

    update(dt: number): void {
        this.rotation.angle += this.speed * dt;
    }
}
