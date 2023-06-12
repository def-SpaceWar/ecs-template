import './style.css';
import { getComponent, type Component } from './ecs/component';
import { entity } from './ecs/entity';
import { behavior } from './ecs/primitive/behavior';
import { createBehaviorSystem } from './ecs/primitive/behavior_system';
import { type Position, position } from './ecs/primitive/position';
import { velocity } from './ecs/physics/velocity';
import { color } from './ecs/render/color';
import { rectangle } from './ecs/render/rectangle';
import { createRenderSystem } from './ecs/render/render_system';
import { type Rotation, rotation } from './ecs/render/rotation';
import { createPhysicsSystem } from './ecs/physics/physics_system';

const systems = [
    createRenderSystem(false),
    createBehaviorSystem(),
    createPhysicsSystem()
], components: Component[] = [];

const wall = entity();
components.push(position(wall, 600, 200));
components.push(color(wall, 0, 255, 0));
components.push(rotation(wall, Math.PI / 4));
components.push(rectangle(wall, [0, 0], [400, 100]));

const player = entity();
components.push(position(player, 400, 400));
components.push(velocity(player, 100, 0));
components.push(color(player, 255, 0, 0));
components.push(rotation(player, Math.PI / 4));
components.push(rectangle(player, [0, 0], [100, 100]));

// the special part
components.push(behavior(player, (components: Component[], dt: number) => {
    const position = getComponent(player, 'position', components) as Position;
    if (position.pos[0] > 871) {
        position.pos[0] = -71;
    }

    const rotation = getComponent(player, 'rotation', components) as Rotation;
    rotation.angle += Math.PI * 0.5 * dt;
}));

const animate = (before: number) => (now: number) => {
    const dt = Math.min((now - before) / 1_000, 0.5);
    systems.forEach(system => system(components, dt));
    requestAnimationFrame(animate(now));
};

requestAnimationFrame(animate(performance.now()));
