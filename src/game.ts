import { type SceneGenerator, Scene } from './util/scene_manager';
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
import { FillScreen } from './behaviors/fill_screen';
import { CustomShapeCollider } from './ecs/physics/custom_shape_collider';
import { CustomShape } from './ecs/render/custom_shape';

export const CAMERA_SPEED = 2;
export const IS_DYNAMIC_SIZE = true;
export const [WIDTH, HEIGHT] = [800, 800] as const;
export const FPS_SAMPLE_SIZE = 25;
export const TPS_SAMPLE_SIZE = 100;

export enum Scenes {
    Game,
    MainMenu
};
export const INITIAL_SCENE = Scenes.Game;

export const SCENES: SceneGenerator[] = [() => {
    const scene = new Scene(Scenes.Game);

    scene.createEntity()
        .add(Name, "Background")
        .add(Position, 0, 0, false)
        .add(Rectangle, 0, 0, 0, 0, [0, 150, 200])
        .behavior(FillScreen)
        ;

    scene.createEntity()
        .add(Name, "Player")
        .add(Tag, "CameraCenter")
        .add(CollisionTag, "Player")
        .add(Position, 200, 400)
        .add(Mass)
        .add(Velocity, 0, -500)
        .add(Restitution)
        .add(Drag, 0.5)
        .add(Acceleration, 0, 1_000) // gravity
        .add(Rotation)
        .add(RotationalVelocity)
        .add(RotationalResistence, 0.5)
        .add(CustomShape, 0, 0, [
            [-70, -50],
            [70, 50],
            [50, -100]
        ], [255, 0, 0])
        .add(CustomShapeCollider, 0, 0, [
            [-70, -50],
            [70, 50],
            [50, -100]
        ])
        .behavior(MyTestBehavior, b => {
            b.speed = 2_000;
            b.jumpPower = 1_250;
        })
        ;

    scene.createEntity()
        .add(Name, "Platform")
        .add(Tag, "Platform")
        .add(CollisionTag, "Platform")
        .add(Position, 400, 700)
        .add(Rectangle, 0, 0, 1_000_000, 200, [100, 255, 0])
        .add(RectangleCollider, 0, 0, 1_000_000, 200)
        ;

    scene.createEntity()
        .add(Name, "Box")
        .add(Tag, "Platform")
        .add(CollisionTag, "Box")
        .add(Position, 400, 400)
        .add(Mass)
        .add(Restitution)
        .add(Drag, 0.5)
        .add(Velocity)
        .add(Acceleration, 0, 1_000)
        .add(Rotation)
        .add(RotationalVelocity)
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
