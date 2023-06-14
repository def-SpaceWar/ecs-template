import './style.css';
import { type Component } from './ecs/component';
import { entity } from './ecs/entity';
import { Behavior } from './ecs/primitive/behavior';
import { createBehaviorSystem } from './ecs/primitive/behavior_system';
import { Position } from './ecs/render/position';
import { Velocity } from './ecs/physics/velocity';
import { Color } from './ecs/render/color';
import { Rectangle } from './ecs/render/rectangle';
import { createRenderSystem } from './ecs/render/render_system';
import { Rotation } from './ecs/render/rotation';
import { createPhysicsSystem } from './ecs/physics/physics_system';
import { MyTestBehavior } from './behaviors/my_test_behavior';
import { RectangleCollider } from './ecs/physics/rectangle_collider';
import { Name } from './ecs/primitive/name';

const systems = [
    createRenderSystem(false),
    createBehaviorSystem(),
    createPhysicsSystem()
], components: Component[] = [];

const wall = entity();
components.push(new Name(wall, "Wall"));
components.push(new Position(wall, 600, 300));
components.push(new Color(wall, 0, 255, 0));
components.push(new Rotation(wall, Math.PI / 4));
components.push(new Rectangle(wall, 0, 0, 400, 100));
components.push(new RectangleCollider(wall, 0, 0, 400, 100));

const player = entity();
components.push(new Name(player, "Player"));
components.push(new Position(player, 400, 400));
components.push(new Velocity(player, 100, 0));
components.push(new Color(player, 255, 0, 0));
components.push(new Rotation(player, Math.PI / 4));
components.push(new Rectangle(player, 0, 0, 100, 100));
components.push(new RectangleCollider(player, 0, 0, 100, 100));
components.push(new Behavior(player, MyTestBehavior));

const animate = (before: number) => (now: number) => {
    const dt = Math.min((now - before) / 1_000, 0.5);
    systems.forEach(system => system(components, dt));
    requestAnimationFrame(animate(now));
};

requestAnimationFrame(animate(performance.now()));
