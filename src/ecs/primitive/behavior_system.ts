import { isComponent } from "../component";
import type { Scene } from "../../util/scene_manager";
import type { System } from "../system";
import { Behavior } from "./behavior";

export function createBehaviorSystem(): System {
    return (scene: Scene, dt: number) => {
        for (let i = 0; i < scene.components.length; i++) {
            const comp = scene.components[i];
            if (!isComponent(Behavior, comp)) continue;
            comp.behavior._update(dt);
        }
    };
}
