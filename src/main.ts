import './style.css';
import { getComponent, type Component } from './ecs/component';
import { entity } from './ecs/entity';
import { Behavior } from './ecs/primitive/behavior';
import { createBehaviorSystem } from './ecs/primitive/behavior_system';
import { Position } from './ecs/primitive/position';
import { Velocity } from './ecs/physics/velocity';
import { Color } from './ecs/render/color';
import { Rectangle } from './ecs/render/rectangle';
import { createRenderSystem } from './ecs/render/render_system';
import { Rotation } from './ecs/render/rotation';
import { createPhysicsSystem } from './ecs/physics/physics_system';

const systems = [
    createRenderSystem(false),
    createBehaviorSystem(),
    createPhysicsSystem()
], components: Component[] = [];

const wall = entity();
components.push(new Position(wall, 600, 200));
components.push(new Color(wall, 0, 255, 0));
components.push(new Rotation(wall, Math.PI / 4));
components.push(new Rectangle(wall, 0, 0, 400, 100));

const player = entity();
components.push(new Position(player, 400, 400));
components.push(new Velocity(player, 100, 0));
components.push(new Color(player, 255, 0, 0));
components.push(new Rotation(player, Math.PI / 4));
components.push(new Rectangle(player, 0, 0, 100, 100));

// the special part
components.push(new Behavior(player, (components: Component[], dt: number) => {
    const position = getComponent(player, Position, components);
    if (position && position.pos[0] > 871) {
        position.pos[0] = -71;
    }

    const rotation = getComponent(player, Rotation, components);
    if (rotation) rotation.angle += Math.PI * 0.5 * dt;
}));

const animate = (before: number) => (now: number) => {
    const dt = Math.min((now - before) / 1_000, 0.5);
    systems.forEach(system => system(components, dt));
    requestAnimationFrame(animate(now));
};

requestAnimationFrame(animate(performance.now()));
