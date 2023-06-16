export type Entity = number;
export type Scene = {
    sceneId: number;
    entityId: number;
    totalEntities: () => number;
    entity: () => Entity;
};

let id = 0;
export function createScene(): Scene {
    const scene = {
        sceneId: id++,
        entityId: 0,
        totalEntities() {
            return this.entityId;
        },
        entity() {
            return this.entityId++;
        }
    };

    // SceneManager.scenes.push(scene);
    return scene;
}
