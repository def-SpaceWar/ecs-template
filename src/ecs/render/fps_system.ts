import type { Scene } from "../../util/scene_manager";
import type { System } from "../system";

export function createFpsSystem(sampleSize: number): System {
    const fpsText = document.getElementById('app')!.appendChild(
        document.createElement('p')
    );
    fpsText.id = "fps";

    const fpsCounts: number[] = [];
    const average = () => {
        if (fpsCounts.length > sampleSize) fpsCounts.shift();
        const total = fpsCounts.reduce((p, v) => v + p, 0);
        return Math.floor(total / fpsCounts.length);
    },
        max = () => Math.floor(Math.max(...fpsCounts)),
        min = () => Math.floor(Math.min(...fpsCounts));

    return (_scene: Scene, dt: number) => {
        fpsCounts.push(1 / dt);
        fpsText.innerText = `FPS: ${average()}; [${min()}, ${max()}]`;
    };
}
