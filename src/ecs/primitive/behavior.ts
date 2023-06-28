import { SceneManager } from "../../util/scene_manager";
import type { Vector2D } from "../../util/vector";
import { type Component, isComponent } from "../component";
import type { Entity } from "../entity";

export class Behavior<T extends BehaviorInterface> implements Component {
    behavior: T;

    constructor(
        public entity: Entity,
        BehaviorKind: BehaviorConstructor<T>,
        onCreate?: (b: T) => void
    ) {
        this.behavior = new BehaviorKind(entity);
        if (onCreate) onCreate(this.behavior);
    }
}

export interface BehaviorConstructor<T extends BehaviorInterface> {
    new(entity: Entity): T;
};

export interface BehaviorInterface {
    entity: Entity;
    _update: (dt: number) => void;
    _onCollision: (other: Entity, collisionPoint: Vector2D) => void;
};

export abstract class BehaviorClass implements BehaviorInterface {
    private init = true;

    constructor(
        public entity: Entity,
    ) { }

    protected start(): void {};
    // @ts-ignore: parameters not used
    protected update(dt: number): void {};

    _update(dt: number) {
        if (this.init) {
            this.start();
            this.init = false;
        }
        this.update(dt);
    }

    // @ts-ignore: parameters not used
    protected onCollision(other: Entity, collisionPoint: Vector2D): void { }
    _onCollision(other: Entity, collisionPoint: Vector2D) {
        this.onCollision(other, collisionPoint);
    }
}

export function isBehavior<T extends BehaviorInterface>(
    Type: new (entity: Entity) => T,
    behavior: BehaviorInterface
): behavior is T {
    return behavior instanceof Type;
}

export function getBehavior<T extends BehaviorInterface>(
    entity: Entity,
    Type: new (entity: Entity) => T,
    components: Component[] = SceneManager.scene.components
): T | undefined {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (
            component.entity == entity &&
            isComponent(Behavior, component) &&
            isBehavior(Type, component.behavior)
        ) return component.behavior;
    }
}

