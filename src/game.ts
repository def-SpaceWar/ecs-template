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

export const [WIDTH, HEIGHT] = [800, 800];
export const DYNAMIC_SIZE = false;

export enum Scenes {
    Game,
    MainMenu
};
export const INITIAL_SCENE = Scenes.Game;

export const SCENES: SceneGenerator[] = [() => {
    const scene = createScene(Scenes.Game);

    const wall = scene.entity();
    scene.components.push(
        new Name(wall, "Wall"),
        new Tag(wall, "Platform"),
        new Position(wall, 400, 700),
        new Color(wall, 0, 255, 0),
        new Rotation(wall, 0),
        new Rectangle(wall, 0, 0, 800, 200),
        new RectangleCollider(wall, 0, 0, 1000, 200)
    );

    const player = scene.entity();
    scene.components.push(
        new Name(player, "Player"),
        new Position(player, 100, 400),
        new Velocity(player, 100, 0),
        new Drag(player, 0.1),
        new Acceleration(player, 0, 1_000),
        new Color(player, 255, 0, 0),
        new Rotation(player),
        new Rectangle(player, 0, 0, 100, 100),
        new RectangleCollider(player, 0, 0, 100, 100),
        new Behavior(player, MyTestBehavior)
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
        new RectangleCollider(wall, 0, 0, 1000, 200)
    );

    return scene;
}];
