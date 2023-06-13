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
    components: Component[]
): T | null {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(Type, component)) return component;
    }
    return null;
}

export function getComponents<T extends Component>(
    entity: Entity,
    Type: new (...args: any[]) => T,
    components: Component[]
): T[] {
    const comps: T[] = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(Type, component)) comps.push(component);
    }
    return comps;
}
