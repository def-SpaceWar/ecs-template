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
import { CollisionTag } from './ecs/physics/collision_tag';
import { RotationalVelocity } from './ecs/physics/rotational_velocity';
import { RotationalResistence } from './ecs/physics/rotational_resistence';

export const [WIDTH, HEIGHT] = [800, 800];
export const IS_DYNAMIC_SIZE = true;

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
        new Rectangle(bg, 0, 0, 1_000_000, 1_000_000)
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
        new Rectangle(platform, 0, 0, 1_000_000, 200),
        new RectangleCollider(platform, 0, 0, 1_000_000, 200)
    );

    const player = scene.entity();
    scene.components.push(
        new Name(player, "Player"),
        new Tag(player, "CameraCenter"),
        new CollisionTag(player, "Player"),
        new Position(player, 200, 400),
        new Mass(player, 1),
        new Velocity(player, 0, 0),
        new Restitution(player, 1),
        new Drag(player, 0.8),
        new Acceleration(player, 0, 1_000),
        new Color(player, 255, 0, 0),
        new Rotation(player),
        new RotationalVelocity(player, 0),
        new RotationalResistence(player, 0.1),
        new Rectangle(player, 0, 0, 100, 100),
        new RectangleCollider(player, 0, 0, 100, 100),
        new Behavior(player, MyTestBehavior, { speed: 10_000, jumpPower: 1_000 }),
        //new Behavior(player, WrapAroundScreen),
    );

    //const box = scene.entity();
    //scene.components.push(
    //    new Name(box, "Box"),
    //    new Tag(box, "Platform"),
    //    new CollisionTag(box, "Box"),
    //    new Position(box, 400, 400),
    //    new Mass(box, 1),
    //    new Restitution(box, 1),
    //    new Drag(box, 0.5),
    //    new Velocity(box, 0, 0),
    //    new Acceleration(box, 0, 1_000),
    //    new Color(box, 100, 50, 0),
    //    new Rotation(box, 0),
    //    new RotationalVelocity(box, 0),
    //    new Rectangle(box, 0, 0, 100, 100),
    //    new RectangleCollider(box, 0, 0, 100, 100),
    //    new Behavior(box, WrapAroundScreen)
    //);

    const ramp3 = scene.entity();
    scene.components.push(
        new Name(ramp3, "Platform"),
        new Tag(ramp3, "Platform"),
        new Position(ramp3, 450, 610),
        new Restitution(ramp3, 1),
        new Color(ramp3, 0, 200, 255),
        new Rotation(ramp3, 31 * Math.PI / 16),
        new Rectangle(ramp3, 0, 0, 600, 100),
        new RectangleCollider(ramp3, 0, 0, 600, 100)
    );


    const ramp = scene.entity();
    scene.components.push(
        new Name(ramp, "Platform"),
        new Tag(ramp, "Platform"),
        new Position(ramp, 450, 610),
        new Restitution(ramp, 1),
        new Color(ramp, 0, 100, 255),
        new Rotation(ramp, 15 * Math.PI / 8),
        new Rectangle(ramp, 0, 0, 600, 100),
        new RectangleCollider(ramp, 0, 0, 600, 100)
    );

    const ramp2 = scene.entity();
    scene.components.push(
        new Name(ramp2, "Platform"),
        new Tag(ramp2, "Platform"),
        new Position(ramp2, 500, 600),
        new Restitution(ramp2, 1),
        new Color(ramp2, 0, 0, 255),
        new Rotation(ramp2, 11 * Math.PI / 6),
        new Rectangle(ramp2, 0, 0, 600, 100),
        new RectangleCollider(ramp2, 0, 0, 600, 100)
    );

    const ramp4 = scene.entity();
    scene.components.push(
        new Name(ramp4, "Platform"),
        new Tag(ramp4, "Platform"),
        new Position(ramp4, 550, 600),
        new Restitution(ramp2, 1),
        new Color(ramp4, 100, 0, 255),
        new Rotation(ramp4, 7 * Math.PI / 4),
        new Rectangle(ramp4, 0, 0, 600, 100),
        new RectangleCollider(ramp4, 0, 0, 600, 100)
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
