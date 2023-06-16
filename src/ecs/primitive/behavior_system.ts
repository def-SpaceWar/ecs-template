import { isComponent } from "../component";
import type { Scene } from "../../util/scene_manager";
import type { System } from "../system";
import { Behavior } from "./behavior";

export function createBehaviorSystem(): System {
    return (scene: Scene, dt: number) => {
        scene.components.forEach(c => {
            if (isComponent(Behavior, c)) {
                c.behavior._update(scene.components, dt);
            }
        });
    };
}
