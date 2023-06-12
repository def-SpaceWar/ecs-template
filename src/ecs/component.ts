import type { Entity } from "./entity";
import type { Rectangle } from "./render/rectangle";
import type { Color } from "./render/color";
import type { Position } from "./primitive/position";
import type { Rotation } from "./render/rotation";
import type { Behavior } from "./primitive/behavior";
import type { Velocity } from "./physics/velocity";

interface ComponentTypeMap {
    "rectangle": Rectangle;
    "color": Color;
    "position": Position;
    "rotation": Rotation;
    "behavior": Behavior;
    "velocity": Velocity;
}

export type Component = {
    type: string;
    entity: Entity;
};

export function isComponent<T extends keyof ComponentTypeMap>(
    type: T,
    component: Component
): component is ComponentTypeMap[T] {
    return component.type == type;
}

export function getComponent<T extends keyof ComponentTypeMap>(
    entity: Entity,
    type: T,
    components: Component[]
): ComponentTypeMap[T] | null {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(type, component)) return component;
    }
    return null;
}

export function getComponents<T extends keyof ComponentTypeMap>(
    entity: Entity,
    type: T,
    components: Component[]
): ComponentTypeMap[T][] {
    const comps: ComponentTypeMap[T][] = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.entity == entity && isComponent(type, component)) comps.push(component);
    }
    return comps;
}
