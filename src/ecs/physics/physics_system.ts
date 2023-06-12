import { type Component, getComponent } from "../component";
import { totalEntities } from "../entity";
import { Position } from "../primitive/position";
import type { System } from "../system";
import { add, scale } from "./vector";
import { Velocity } from "./velocity";

export function createPhysicsSystem(): System {
    return (components: Component[], dt: number) => {
        for (let e = 0; e < totalEntities(); e++) {
            const velocity = getComponent(e, Velocity, components);
            if (velocity) {
                const position = getComponent(e, Position, components);
                if (position) {
                    position.pos = add(position.pos, scale(velocity.vel, dt));
                }
            }
        }
    };
}
