import type { Component } from "../ecs/component";
import type { Entity } from "../ecs/entity";

export type Scene = {
    sceneId: number;
    entityId: number;
    totalEntities: () => number;
    entity: () => Entity;
    components: Component[];
};

export type SceneGenerator = () => Scene;

export namespace SceneManager {
    export let currentScene: Scene;
    export let sceneList: SceneGenerator[] = [];

    export const setScene = (id: number) => {
        currentScene = sceneList.filter(s => s().sceneId == id)[0]();
    };
}

export function createScene(id: number): Scene {
    const scene = {
        sceneId: id,
        entityId: 0,
        totalEntities() {
            return this.entityId;
        },
        entity() {
            return this.entityId++;
        },
        components: []
    };

    return scene;
}
