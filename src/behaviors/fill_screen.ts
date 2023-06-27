import { getComponent } from "../ecs/component";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Rectangle } from "../ecs/render/rectangle";
import { DIMENSIONS } from "../ecs/render/render_system";

export class FillScreen extends BehaviorClass {
    rect: Rectangle;

    start() {
        this.rect = getComponent(this.entity, Rectangle)!;
        this.rect.dims = DIMENSIONS;
    }
}
