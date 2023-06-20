import { getComponent, getComponents } from "../ecs/component";
import { Velocity } from "../ecs/physics/velocity";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Position } from "../ecs/render/position";
import { DIMENSIONS } from "../ecs/render/render_system";
import { Input } from "../util/input";
import { Vector } from "../util/vector";
import add = Vector.add;
import type { Entity } from "../ecs/entity";
import { Tag } from "../ecs/primitive/tag";

export class MyTestBehavior extends BehaviorClass {
    position: Position;
    velocity: Velocity;
    speed = 1_000;
    isGrounded = true;
    jumpPower = 1_000;

    start(): void {
        this.position = getComponent(this.entity, Position)!;
        this.velocity = getComponent(this.entity, Velocity)!;
    }

    update(dt: number): void {
        if (this.position.pos[0] > 71 + DIMENSIONS[0]) this.position.pos[0] = -71;
        if (this.position.pos[0] < -71) this.position.pos[0] = 71 + DIMENSIONS[0];

        if (Input.getKey("a")) this.moveLeft(dt);
        if (Input.getKey("e") || Input.getKey("d")) this.moveRight(dt);
        if (Input.getKey(",") || Input.getKey("w")) this.jump();
        //if (Input.getKey("o") || Input.getKey("s")) this.direction[1] += 1;
    }

    moveLeft(dt: number) {
        this.velocity.vel = add(this.velocity.vel, [-this.speed * dt, 0]);
    }

    moveRight(dt: number) {
        this.velocity.vel = add(this.velocity.vel, [this.speed * dt, 0]);
    }

    jump() {
        if (!this.isGrounded) return;
        this.velocity.vel = add(this.velocity.vel, [0, -this.jumpPower]);
        this.isGrounded = false;
    }

    onCollision(other: Entity): void {
        const tags = getComponents(other, Tag);
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].tag == "Platform") {
                this.isGrounded = true;
            }
        }
    }
}
