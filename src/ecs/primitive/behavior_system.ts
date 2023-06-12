import { type Component, isComponent } from "../component";
import type { System } from "../system";
import { Behavior } from "./behavior";

export function createBehaviorSystem(): System {
    return (components: Component[], dt: number) => {
        components.forEach(c => {
            if (isComponent(Behavior, c)) {
                c.behavior(components, dt);
            }
        })
    };
}
