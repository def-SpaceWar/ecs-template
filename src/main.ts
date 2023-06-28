import './style.css';
import { SceneManager } from './util/scene_manager';
import { createBehaviorSystem } from './ecs/primitive/behavior_system';
import { createRenderSystem } from './ecs/render/render_system';
import { createPhysicsSystem } from './ecs/physics/physics_system';
import { Input } from './util/input';
import { createFpsSystem } from './ecs/render/fps_system';
import { createTpsSystem } from './ecs/physics/tps_system';
import {
    SCENES,
    INITIAL_SCENE,
    IS_DYNAMIC_SIZE,
    WIDTH,
    HEIGHT,
    CAMERA_SPEED,
    FPS_SAMPLE_SIZE,
    TPS_SAMPLE_SIZE
} from './game';

onload = () => {
    SceneManager.sceneList = SCENES;
    SceneManager.setScene(INITIAL_SCENE);
    Input.initKeys();

    const renderSystems = [
        createRenderSystem(CAMERA_SPEED, IS_DYNAMIC_SIZE, WIDTH, HEIGHT),
        createFpsSystem(FPS_SAMPLE_SIZE)
    ];
    const animate = (before: number) => (now: number) => {
        const dt = Math.max(Math.min((now - before) / 1_000, 0.1), 0.001);
        for (const system of renderSystems) {
            system(SceneManager.scene, dt);
        }
        requestAnimationFrame(animate(now));
    };
    requestAnimationFrame(animate(performance.now()));

    const nonRenderSystems = [
        createBehaviorSystem(),
        createPhysicsSystem(),
        createTpsSystem(TPS_SAMPLE_SIZE)
    ];
    let before = performance.now(), now = Infinity;
    setInterval(() => {
        now = performance.now();
        const dt = Math.max(Math.min((now - before) / 1_000, 0.01), 0.001);
        for (const system of nonRenderSystems) {
            system(SceneManager.scene, dt);
        }
        before = now;
    }, 0);
};
