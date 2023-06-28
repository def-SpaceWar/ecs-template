import { SceneManager } from "../util/scene_manager";
import type { Entity } from "./entity";

export interface ComponentConstructor<T extends any[]> {
    new(entity: Entity, ...args: T): Component;
};

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
    components: Component[] = SceneManager.scene.components
): T | undefined {
    for (const component of components) {
        if (component.entity == entity && isComponent(Type, component)) return component;
    }
}

export function getComponents<T extends Component>(
    entity: Entity,
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.scene.components
): T[] {
    const comps: T[] = [];
    for (const component of components) {
        if (component.entity == entity && isComponent(Type, component)) comps.push(component);
    }
    return comps;
}

export function getComponentOfTypes<T extends Component>(
    entity: Entity,
    Types: (new (...args: any[]) => T)[],
    components: Component[] = SceneManager.scene.components
): T | undefined {
    for (const component of components) {
        for (const Type of Types) {
            if (component.entity == entity && isComponent(Type, component)) return component as T;
        }
    }
}

export function getComponentsOfTypes<T extends Component>(
    entity: Entity,
    Types: (new (...args: any[]) => T)[],
    components: Component[] = SceneManager.scene.components
): T[] {
    const comps: T[] = [];
    for (const component of components) {
        for (const Type of Types) {
            if (component.entity == entity && isComponent(Type, component)) comps.push(component as T);
        }
    }
    return comps;
}

export function findComponent<T extends Component>(
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.scene.components
): T | undefined {
    for (const component of components) {
        if (isComponent(Type, component)) return component;
    }
}

export function findComponents<T extends Component>(
    Type: new (...args: any[]) => T,
    components: Component[] = SceneManager.scene.components
): T[] {
    const comps: T[] = [];
    for (const component of components) {
        if (isComponent(Type, component)) comps.push(component);
    }
    return comps;
}

export function findComponentsOfTypes<T extends Component>(
    Types: (new (...args: any[]) => T)[],
    components: Component[] = SceneManager.scene.components
): T[] {
    const comps: T[] = [];
    for (const component of components) {
        for (const Type of Types) {
            if (!(isComponent(Type, component))) continue;
            comps.push(component as T);
        }
    }
    return comps;
}

export function removeComponent(
    component: Component,
    components: Component[] = SceneManager.scene.components
) {
    const index = components.indexOf(component);
    if (index > -1) components.splice(index, 1);
}
