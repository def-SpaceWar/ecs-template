import { getComponent } from "../ecs/component";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";

export class WrapAroundScreen extends BehaviorClass {
    private position: Position;

    protected start(): void {
        this.position = getComponent(this.entity, Position)!;
    }

    protected update(_dt: number): void {
        if (this.position.pos[0] > DIMENSIONS[0] + 200) {
            this.position.pos[0] = -100;
        } else if (this.position.pos[0] < -200) {
            this.position.pos[0] = DIMENSIONS[0] + 100;
        }

        if (this.position.pos[1] > DIMENSIONS[1] + 200) {
            this.position.pos[1] = -200;
        }
    }
}
