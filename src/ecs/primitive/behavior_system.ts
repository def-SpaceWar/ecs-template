import { type Component, isComponent } from "../component";
import type { Scene } from "../entity";
import type { System } from "../system";
import { Behavior } from "./behavior";

export function createBehaviorSystem(): System {
    return (components: Component[], _scene: Scene, dt: number) => {
        components.forEach(c => {
            if (isComponent(Behavior, c)) {
                c.behavior._update(components, dt);
            }
        })
    };
}
