import { type Component } from './ecs/component';
import { entity } from './ecs/entity';
import { position } from './ecs/primitive/position';
import { color } from './ecs/render/color';
import { rectangle } from './ecs/render/rectangle';
import { createRenderSystem } from './ecs/render/render_system';
import { rotation } from './ecs/render/rotation';
import './style.css';

const systems = [
    createRenderSystem(false)
], components: Component[] = [];

const player = entity();
components.push(position(player, 400, 400));
components.push(color(player, 255, 0, 0));
components.push(rotation(player, Math.PI / 4));
components.push(rectangle(player, [0, 0], [100, 100]));

const wall = entity();
components.push(position(wall, 600, 200));
components.push(color(wall, 0, 255, 0));
components.push(rotation(wall, Math.PI / 4));
components.push(rectangle(wall, [0, 0], [400, 100]));

const animate = (before: number) => (now: number) => {
    const dt = Math.min((now - before) / 1_000, 0.5);
    systems.forEach(system => system(components, dt));
    requestAnimationFrame(animate(now));
};

requestAnimationFrame(animate(performance.now()));
