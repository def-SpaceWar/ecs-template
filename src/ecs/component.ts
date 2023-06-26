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

export function getComponentsOfTypes<T extends Component>(
    entity: Entity,
    types: (new (...args: any[]) => T)[],
    components: Component[] = SceneManager.currentScene.components
): T[] {
    const comps: T[] = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        for (let j = 0; j < types.length; j++) {
            if (component.entity == entity && isComponent(types[j], component)) comps.push(component as T);
        }
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
