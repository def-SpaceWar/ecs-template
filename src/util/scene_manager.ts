import type { Component, ComponentConstructor } from "../ecs/component";
import type { Entity } from "../ecs/entity";
import { Behavior, type BehaviorInterface } from "../ecs/primitive/behavior";

export class Scene {
    entityId: Entity = 0;
    deletedEntities: Entity[] = [];
    components: Component[] = [];

    constructor(public sceneId: number) { }

    entity() {
        if (this.deletedEntities.length > 0) return this.deletedEntities.shift()!;
        return this.entityId++;
    }

    destroy(entity: Entity) {
        this.deletedEntities.push(entity);
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].entity != entity) continue;
            this.components.splice(i, 1);
            i--;
        }
    }

    totalEntities() {
        return this.entityId;
    }

    createEntity() {
        const scene = this;
        return {
            entity: this.entity(),
            add<T extends any[]>(
                Type: ComponentConstructor<T>,
                ...args: T
            ) {
                scene.components.push(new Type(this.entity, ...args));
                return this;
            },
            behavior<T extends BehaviorInterface>(
                Type: new (entity: Entity) => T,
                onCreate?: (b: T) => void
            ) {
                scene.components.push(new Behavior(this.entity, Type, onCreate));
                return this;
            },
        }
    }
}

export type SceneGenerator = () => Scene;

export namespace SceneManager {
    export let scene: Scene;
    export let sceneList: SceneGenerator[] = [];

    export const setScene = (id: number) => {
        scene = sceneList.filter(s => s().sceneId == id)[0]();
    };
}
