import { Component, isComponent } from "../component";
import type { System } from "../system";

export function createBehaviorSystem(): System {
    return (components: Component[], dt: number) => {
        components.forEach(c => {
            if (isComponent('behavior', c)) {
                c.behavior(components, dt);
            }
        })
    };
}
