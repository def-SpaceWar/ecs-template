import { SceneManager } from "../../util/scene_manager";
import type { Vector2D } from "../../util/vector";
import { type Component, isComponent } from "../component";
import type { Entity } from "../entity";

export class Behavior<T extends any> implements Component {
    behavior: BehaviorInterface<T>;

    constructor(
        public entity: Entity,
        BehaviorKind: BehaviorConstructor<T>,
        parameters?: T
    ) {
        this.behavior = new BehaviorKind(entity);
        this.behavior.parameters = parameters;
    }
}

export interface BehaviorConstructor<T extends any> {
    new(entity: Entity): BehaviorInterface<T>;
};

export interface BehaviorInterface<T extends any> {
    entity: Entity;
    parameters?: T;
    _update: (dt: number) => void;
    onCollision?: (other: Entity, collisionPoint: Vector2D) => void;
};

export abstract class BehaviorClass implements BehaviorInterface<unknown> {
    init = true;
    parameters: unknown;

    constructor(
        public entity: Entity,
    ) { }

    start(): void { };
    abstract update(dt: number): void;

    _update(dt: number) {
        if (this.init) {
            this.start();
            this.init = false;
        }
        this.update(dt);
    }

    // @ts-ignore: parameters not used
    onCollision(other: Entity, collisionPoint: Vector2D) { }
}

export function isBehavior<T extends BehaviorInterface<K>, K extends any>(
    Type: new (entity: Entity) => T,
    behavior: BehaviorInterface<K>
): behavior is T {
    return behavior instanceof Type;
}

export function getBehavior<T extends BehaviorInterface<K>, K extends any>(
    entity: Entity,
    Type: new (entity: Entity) => T,
    components: Component[] = SceneManager.currentScene.components
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
