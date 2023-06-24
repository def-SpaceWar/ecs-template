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
import { WrapAroundScreen } from './behaviors/wrap_around_screen';
import { CollisionTag } from './ecs/physics/collision_tag';
import { RotationalVelocity } from './ecs/physics/rotational_velocity';

export const [WIDTH, HEIGHT] = [800, 800];
export const IS_DYNAMIC_SIZE = false;

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

    const platform = scene.entity();
    scene.components.push(
        new Name(platform, "Platform"),
        new Tag(platform, "Platform"),
        new CollisionTag(platform, "Platform"),
        new Position(platform, 400, 700),
        new Restitution(platform, 0.5),
        new Velocity(platform, 0, 0),
        new Color(platform, 100, 255, 0),
        new Rotation(platform, 0),
        new Rectangle(platform, 0, 0, 800, 200),
        new RectangleCollider(platform, 0, 0, 1_600, 200)
    );

    const player = scene.entity();
    scene.components.push(
        new Name(player, "Player"),
        new CollisionTag(player, "Player"),
        new Position(player, 200, 400),
        new Mass(player, 1),
        new Velocity(player, 0, 0),
        new Restitution(player, 1),
        new Drag(player, 0.5),
        new Acceleration(player, 0, 1_000),
        new Color(player, 255, 0, 0),
        new Rotation(player),
        new RotationalVelocity(player, 0),
        new Rectangle(player, 0, 0, 100, 100),
        new RectangleCollider(player, 0, 0, 100, 100),
        new Behavior(player, MyTestBehavior),
        new Behavior(player, WrapAroundScreen),
    );

    const box = scene.entity();
    scene.components.push(
        new Name(box, "Box"),
        new Tag(box, "Platform"),
        new CollisionTag(box, "Box"),
        new Position(box, 400, 400),
        new Mass(box, 1),
        new Restitution(box, 1),
        new Drag(box, 0.5),
        new Velocity(box, 0, 0),
        new Acceleration(box, 0, 1_000),
        new Color(box, 100, 50, 0),
        new Rotation(box, 0),
        new RotationalVelocity(box, 0),
        new Rectangle(box, 0, 0, 100, 100),
        new RectangleCollider(box, 0, 0, 100, 100),
        new Behavior(box, WrapAroundScreen)
    );

    const Ramp = scene.entity();
    scene.components.push(
        new Name(Ramp, "Platform"),
        new Tag(Ramp, "Platform"),
        new Position(Ramp, 500, 600),
        new Restitution(Ramp, 1),
        new Color(Ramp, 0, 0, 255),
        new Rotation(Ramp, 7 * Math.PI / 4),
        new Rectangle(Ramp, 0, 0, 300, 100),
        new RectangleCollider(Ramp, 0, 0, 300, 100)
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
