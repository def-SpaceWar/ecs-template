import type { Component, ComponentConstructor } from "../ecs/component";

export class Scene {
    entityId = 0;
    components: Component[] = [];

    constructor(public sceneId: number) {}

    entity() {
        return this.entityId++;
    }

    totalEntities() {
        return this.entityId;
    }

    createEntity() {
        const scene = this;
        return {
            entity: this.entity(),
            add<T extends any[]>(Type: ComponentConstructor<T>, ...args: T) {
                scene.components.push(new Type(this.entity, ...args));
                return this;
            }
        }
    }
}

export type SceneGenerator = () => Scene;

export namespace SceneManager {
    export let currentScene: Scene;
    export let sceneList: SceneGenerator[] = [];

    export const setScene = (id: number) => {
        currentScene = sceneList.filter(s => s().sceneId == id)[0]();
    };
}
