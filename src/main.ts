import './style.css';
import { type Component } from './ecs/component';
import { createScene } from './ecs/entity';
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
import { Input } from './util/input';
import { Acceleration } from './ecs/physics/acceleration';

export const [WIDTH, HEIGHT] = [800, 800];
const systems = [
    createRenderSystem(false, WIDTH, HEIGHT),
    createBehaviorSystem(),
    createPhysicsSystem()
], components: Component[] = [];

const scene1 = createScene();
console.log(scene1.sceneId);

const wall = scene1.entity();
components.push(new Name(wall, "Wall"),
    new Position(wall, 400, 700),
    new Color(wall, 0, 255, 0),
    new Rotation(wall, 0),
    new Rectangle(wall, 0, 0, 800, 200),
    new RectangleCollider(wall, 0, 0, 1000, 200)
);

const player = scene1.entity();
components.push(new Name(player, "Player"),
    new Position(player, 100, 400),
    new Velocity(player, 100, 0),
    new Acceleration(player, 0, 300),
    new Color(player, 255, 0, 0),
    new Rotation(player),
    new Rectangle(player, 0, 0, 100, 100),
    new RectangleCollider(player, 0, 0, 100, 100),
    new Rectangle(player, 0, 50, 50, 50),
    new RectangleCollider(player, 0, 50, 50, 50),
    new Rectangle(player, 50, 0, 50, 50),
    new RectangleCollider(player, 50, 0, 50, 50),
    new Rectangle(player, -50, 0, 50, 50),
    new RectangleCollider(player, -50, 0, 50, 50),
    new Rectangle(player, 0, -50, 50, 50),
    new RectangleCollider(player, 0, -50, 50, 50),
    new Behavior(player, MyTestBehavior)
);

Input.initKeys();

// still primitive
const animate = (before: number) => (now: number) => {
    const dt = Math.min((now - before) / 1_000, 0.1);
    systems.forEach(system => system(components, scene1, dt));
    requestAnimationFrame(animate(now));
};
requestAnimationFrame(animate(performance.now()));
