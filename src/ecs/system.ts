import type { Component } from "./component";
import type { Scene } from "./entity";

export type System = (components: Component[], scene: Scene, dt: number) => void;
