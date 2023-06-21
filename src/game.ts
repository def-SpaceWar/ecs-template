import { type SceneGenerator, createScene } from './util/scene_manager';
import { Behavior } from './ecs/primitive/behavior';
import { Position } from './ecs/render/position';
import { Velocity } from './ecs/physics/velocity';
import { Color } from './ecs/render/color';
import { Rectangle } from './ecs/render/rectangle';
import { Rotation } from './ecs/render/rotation';
import { MyTestBehavior } from './behaviors/my_test_behavior';
import { RectangleCollider } from './ecs/physics/rectangle_collider';
import { Name } from './ecs/primitive/name';
import { Acceleration } from './ecs/physics/acceleration';
import { Drag } from './ecs/physics/drag';
import { Tag } from './ecs/primitive/tag';
import { Mass } from './ecs/physics/mass';
import { Restitution } from './ecs/physics/restitution';

export const [WIDTH, HEIGHT] = [800, 800];
export const DYNAMIC_SIZE = false;

export enum Scenes {
    Game,
    MainMenu
};
export const INITIAL_SCENE = Scenes.Game;

export const SCENES: SceneGenerator[] = [() => {
    const scene = createScene(Scenes.Game);

    const bg = scene.entity();
    scene.components.push(
        new Name(bg, "Background"),
        new Position(bg, 400, 400),
        new Color(bg, 0, 150, 200),
        new Rectangle(bg, 0, 0, WIDTH, HEIGHT)
    );

    const player = scene.entity();
    scene.components.push(
        new Name(player, "Player"),
        new Position(player, 200, 400),
        new Velocity(player, 0, 0),
        new Restitution(player, 1),
        new Drag(player, 0.1),
        new Acceleration(player, 0, 1_000),
        new Color(player, 255, 0, 0),
        new Rotation(player),
        new Rectangle(player, 0, 0, 100, 100),
        new RectangleCollider(player, 0, 0, 100, 100),
        new Behavior(player, MyTestBehavior)
    );

    const platform = scene.entity();
    scene.components.push(
        new Name(platform, "Platform"),
        new Tag(platform, "Platform"),
        new Position(platform, 199, 700),
        new Mass(platform, Infinity),
        new Restitution(platform, 1),
        new Velocity(platform, 0, 0),
        new Color(platform, 0, 255, 0),
        new Rotation(platform, 0),
        new Rectangle(platform, 0, 0, 300, 100),
        new RectangleCollider(platform, 0, 0, 300, 100),
    );

    const platform2 = scene.entity();
    scene.components.push(
        new Name(platform2, "Platform2"),
        new Tag(platform2, "Platform"),
        new Position(platform2, WIDTH - 200, 700),
        new Mass(platform2, Infinity),
        new Restitution(platform2, 0),
        new Velocity(platform2, 0, 0),
        new Color(platform2, 255, 100, 0),
        new Rotation(platform2, 0),
        new Rectangle(platform2, 0, 0, 350, 100),
        new RectangleCollider(platform2, 0, 0, 350, 100)
    );

    const platform3 = scene.entity();
    scene.components.push(
        new Name(platform3, "Platform3"),
        new Tag(platform3, "Platform"),
        new Position(platform3, WIDTH - 200, 400),
        new Mass(platform3, Infinity),
        new Restitution(platform3, 0.5),
        new Velocity(platform3, 0, 0),
        new Color(platform3, 0, 0, 255),
        new Rectangle(platform3, 0, 0, 375, 100),
        new RectangleCollider(platform3, 0, 0, 375, 100)
    );

    return scene;
}, () => {
    const scene = createScene(Scenes.MainMenu);

    const wall = scene.entity();
    scene.components.push(new Name(wall, "Wall"),
        new Position(wall, 400, 700),
        new Color(wall, 200, 0, 0),
        new Rotation(wall, 0),
        new Rectangle(wall, 0, 0, 800, 200),
        new RectangleCollider(wall, 0, 0, 1_000, 200)
    );

    return scene;
}];
