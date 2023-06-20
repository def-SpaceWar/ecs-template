import { SceneManager } from "../util/scene_manager";
import type { Entity } from "./entity";

export interface Component {
    entity: Entity;
};

export function isComponent<T extends Component>(
    Type: new (...args: any[]) => T,
    component: Component
): component is T {
    return component instanceof Type;
}

export function getComponent<T extends Component>(
    entity: Entity,
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.currentScene.components
): T | undefined {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(Type, component)) return component;
    }
    return undefined;
}

export function getComponents<T extends Component>(
    entity: Entity,
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.currentScene.components
): T[] {
    const comps: T[] = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(Type, component)) comps.push(component);
    }
    return comps;
}

export function findComponent<T extends Component>(
    Type: new (...args: any[]) => T, 
    components: Component[] = SceneManager.currentScene.components
): T | undefined {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (isComponent(Type, component)) return component;
    }
    return undefined;
}

export function findComponents<T extends Component>(
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.currentScene.components
): T[] {
    const comps: T[] = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (isComponent(Type, component)) comps.push(component);
    }
    return comps;
}

export function removeComponent(
    component: Component,
    components: Component[] = SceneManager.currentScene.components
) {
    const index = components.indexOf(component);
    if (index > -1) components.splice(index, 1);
}
