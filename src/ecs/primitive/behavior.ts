import { SceneManager } from "../../util/scene_manager";
import { type Component, getComponent, isComponent } from "../component";
import type { Entity } from "../entity";
import { Name } from "./name";

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
    onCollision?: (other: Entity) => void;
};

export abstract class BehaviorClass implements BehaviorInterface {
    init = true;

    constructor(
        public entity: Entity,
    ) {}

    start(): void {};

    abstract update(dt: number): void;

    _update(dt: number) {
        if (this.init) {
            this.start();
            this.init = false;
        }
        this.update(dt);
    }

    // @ts-ignore: parameter `other` not used
    onCollision(other: Entity) {}
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

export function requireComponent<T extends Component>(
    entity: Entity,
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.currentScene.components
): T | undefined {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(Type, component)) return;
    }
    throw new Error(`Component not found! ${entity} ${getComponent(entity, Name)?.name} ${Type}`);
}
