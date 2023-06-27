import { type SceneGenerator, Scene } from './util/scene_manager';
import { Behavior } from './ecs/primitive/behavior';
import { Position } from './ecs/render/position';
import { Velocity } from './ecs/physics/velocity';
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
    const scene = new Scene(Scenes.Game);

    scene.createEntity()
        .add(Name, "Background")
        .add(Position, 400, 400)
        .add(Rectangle, 0, 0, 1_000_000, 1_000_000, [0, 150, 200])
    ;

    scene.createEntity()
        .add(Name, "Player")
        .add(Tag, "CameraCenter")
        .add(CollisionTag, "Player")
        .add(Position, 200, 400)
        .add(Mass, 1)
        .add(Velocity, 0, -500)
        .add(Restitution, 1)
        .add(Drag, 0.5)
        .add(Acceleration, 0, 1_000)
        .add(Rotation, 0)
        .add(RotationalVelocity, 12)
        .add(RotationalResistence, 0.8)
        .add(Rectangle, 0, 0, 100, 100, [255, 0, 0])
        .add(RectangleCollider, 0, 0, 100, 100)
        .add(Rectangle, 50, 0, 100, 10, [0, 0, 255])
        .add(RectangleCollider, 50, 0, 100, 10)
        .add(Behavior, MyTestBehavior, { speed: 1_000, jumpPower: 1_000 })
    ;

    scene.createEntity()
        .add(Name, "Platform")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 400, 700)
        .add(Rotation, 0)
        .add(Rectangle, 0, 0, 1_000_000, 200, [100, 255, 0])
        .add(RectangleCollider, 0, 0, 1_000_000, 200)
    ;

    scene.createEntity()
        .add(Name, "Box")
        .add(Tag, "Platform")
        .add(CollisionTag, "Box")
        .add(Position, 400, 400)
        .add(Mass, 1)
        .add(Restitution, 1)
        .add(Drag, 0.5)
        .add(Velocity, 0, 0)
        .add(Acceleration, 0, 1_000)
        .add(Rotation, 0)
        .add(RotationalVelocity, 0)
        .add(RotationalResistence, 0.3)
        .add(Rectangle, 0, 0, 100, 100, [100, 50, 0])
        .add(RectangleCollider, 0, 0, 100, 100)
    ;

    scene.createEntity()
        .add(Name, "Ramp1")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 450, 610)
        .add(Rotation, 31 * Math.PI / 16)
        .add(Rectangle, 0, 0, 600, 100, [0, 200, 255])
        .add(RectangleCollider, 0, 0, 600, 100)
    ;


    scene.createEntity()
        .add(Name, "Ramp2")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 450, 610)
        .add(Rotation, 15 * Math.PI / 8)
        .add(Rectangle, 0, 0, 600, 100, [0, 100, 255])
        .add(RectangleCollider, 0, 0, 600, 100)
    ;

    scene.createEntity()
        .add(Name, "Ramp3")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 500, 600)
        .add(Rotation, 11 * Math.PI / 6)
        .add(Rectangle, 0, 0, 600, 100, [0, 0, 255])
        .add(RectangleCollider, 0, 0, 600, 100)
    ;

    scene.createEntity()
        .add(Name, "Ramp4")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 550, 600)
        .add(Rotation, 8 * Math.PI / 4.5)
        .add(Rectangle, 0, 0, 800, 100, [100, 0, 255])
        .add(RectangleCollider, 0, 0, 800, 100)
    ;

    return scene;
}, () => {
    const scene = new Scene(Scenes.MainMenu);

    scene.createEntity()
        .add(Name, "Wall")
        .add(Position, 0, 200)
        .add(Rectangle, 0, 0, 800, 200, [200, 0, 0])
        .add(RectangleCollider, 0, 0, 1_000, 200)
    ;

    return scene;
}];
