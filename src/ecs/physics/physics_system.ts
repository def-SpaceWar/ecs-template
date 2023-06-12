import { Component, getComponent } from "../component";
import { totalEntities } from "../entity";
import type { System } from "../system";
import { add, scale } from "./vector";

export function createPhysicsSystem(): System {
    return (components: Component[], dt: number) => {
        for (let e = 0; e < totalEntities(); e++) {
            const velocity = getComponent(e, 'velocity', components);
            if (velocity) {
                const position = getComponent(e, 'position', components);
                if (position) {
                    position.pos = add(position.pos, scale(velocity.vel, dt));
                }
            }
        }
    };
}
