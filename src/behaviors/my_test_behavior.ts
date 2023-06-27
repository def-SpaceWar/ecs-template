import { getComponent, getComponents } from "../ecs/component";
import { Velocity } from "../ecs/physics/velocity";
import { BehaviorClass } from "../ecs/primitive/behavior";
import { Position } from "../ecs/render/position";
import { Input } from "../util/input";
import { Vector, type Vector2D } from "../util/vector";
import type { Entity } from "../ecs/entity";
import { Tag } from "../ecs/primitive/tag";

export class MyTestBehavior extends BehaviorClass {
    /** Speed in px/s/s */
    public speed = 1_000;
    /** Instantaneous velocity upwards */
    public jumpPower = 1_000;

    private position: Position;
    private velocity: Velocity;
    private isGrounded = true;

    protected start(): void {
        this.position = getComponent(this.entity, Position)!;
        this.velocity = getComponent(this.entity, Velocity)!;
    }

    protected update(dt: number): void {
        if (Input.getKey("a")) this.moveLeft(dt);
        if (Input.getKey("e") || Input.getKey("d")) this.moveRight(dt);
        if (Input.getKey(",") || Input.getKey("w")) this.jump();
        this.isGrounded = false;
    }

    private moveLeft(dt: number) {
        this.velocity.vel = Vector.add(this.velocity.vel, [-this.speed * dt, 0]);
    }

    private moveRight(dt: number) {
        this.velocity.vel = Vector.add(this.velocity.vel, [this.speed * dt, 0]);
    }

    private jump() {
        if (!this.isGrounded) return;
        this.velocity.vel[1] = -this.jumpPower;
    }

    protected onCollision(other: Entity, collisionPoint: Vector2D): void {
        const tags = getComponents(other, Tag);
        for (let i = 0; i < tags.length; i++) {
            if (!(tags[i].tag == "Platform" && collisionPoint[1] > this.position.pos[1])) continue;
            this.isGrounded = true;
        }
    }
}
