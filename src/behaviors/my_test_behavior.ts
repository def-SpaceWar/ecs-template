import { getComponent, type Component } from "../ecs/component";
import type { Entity } from "../ecs/entity";
import { Velocity } from "../ecs/physics/velocity";
import { BehaviorClass, type BehaviorInterface } from "../ecs/primitive/behavior";
import { Name } from "../ecs/primitive/name";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Rotation } from "../ecs/render/rotation";
import { Input } from "../util/input";
import { Vector } from "../util/vector";

export class MyTestBehavior extends BehaviorClass implements BehaviorInterface {
    position: Position;
    rotation: Rotation;
    velocity: Velocity;
    speed = 500;
    direction = Vector.zero();

    start(components: Component[]): void {
        this.position = getComponent(this.entity, Position, components)!;
        this.rotation = getComponent(this.entity, Rotation, components)!;
        this.velocity = getComponent(this.entity, Velocity, components)!;
    }

    update(_components: Component[], dt: number) {
        //this.rotation.angle += Math.PI * 0.1 * dt;
        if (this.position.pos[0] > 71 + DIMENSIONS[0]) this.position.pos[0] = -71;
        if (this.position.pos[0] < -71) this.position.pos[0] = 71 + DIMENSIONS[0];

        this.direction = [0, 0];
        if (Input.getKey("a")) {
            this.direction[0] -= 1;
        }
        if (Input.getKey("e") || Input.getKey("d")) {
            this.direction[0] += 1;
        }
        if (Input.getKey(",") || Input.getKey("w")) {
            this.direction[1] -= 1;
        }
        if (Input.getKey("o") || Input.getKey("s")) {
            this.direction[1] += 1;
        }

        this.velocity.vel = Vector.add(Vector.scale(this.direction, this.speed * dt), this.velocity.vel);
    }

    onCollision(other: Entity, components: Component[], _dt: number) {
        console.log(getComponent(other, Name, components)?.name);
    }
}
