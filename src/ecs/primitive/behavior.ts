import { SceneManager } from "../../util/scene_manager";
import { Component, isComponent } from "../component";
import type { Entity } from "../entity";

export class Behavior implements Component {
    behavior: BehaviorInterface;

    constructor(
        public entity: Entity,
        BehaviorKind: BehaviorConstructor
    ) {
        this.behavior = new BehaviorKind(entity);
    }
}

export interface BehaviorConstructor {
    new(entity: Entity): BehaviorInterface;
};

export interface BehaviorInterface {
    entity: Entity;
    _update: (dt: number) => void;
    onCollision?: (other: Entity, dt: number) => void;
};

export abstract class BehaviorClass implements BehaviorInterface {
    init = true;

    constructor(
        public entity: Entity,
    ) {}

    start(): void {
    };

    abstract update(dt: number): void;

    _update(dt: number) {
        if (this.init) {
            this.start();
            this.init = false;
        }
        this.update(dt);
    }

    onCollision(other: Entity, dt: number) {
        other;
        dt;
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
    return undefined;
}
