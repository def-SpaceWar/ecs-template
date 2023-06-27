import './style.css';
import { SceneManager } from './util/scene_manager';
import { createBehaviorSystem } from './ecs/primitive/behavior_system';
import { createRenderSystem } from './ecs/render/render_system';
import { createPhysicsSystem } from './ecs/physics/physics_system';
import { Input } from './util/input';
import { SCENES, INITIAL_SCENE, IS_DYNAMIC_SIZE, WIDTH, HEIGHT } from './game';

onload = () => {
    SceneManager.sceneList = SCENES;
    SceneManager.setScene(INITIAL_SCENE);
    Input.initKeys();

    const renderSystems = [
        createRenderSystem(IS_DYNAMIC_SIZE, WIDTH, HEIGHT)
    ];
    const animate = (before: number) => (now: number) => {
        const dt = Math.max(Math.min((now - before) / 1_000, 0.1), 0.001);
        for (let i = 0; i < renderSystems.length; i++) {
            renderSystems[i](SceneManager.currentScene, dt);
        }
        requestAnimationFrame(animate(now));
    };
    requestAnimationFrame(animate(performance.now()));

    const nonRenderSystems = [
        createBehaviorSystem(),
        createPhysicsSystem()
    ];
    let before = performance.now(), now = Infinity;
    setInterval(() => {
        now = performance.now();
        const dt = Math.max(Math.min((now - before) / 1_000, 0.1), 0.001);
        for (let i = 0; i < nonRenderSystems.length; i++) {
            nonRenderSystems[i](SceneManager.currentScene, dt);
        }
        before = now;
    }, 0);
};
