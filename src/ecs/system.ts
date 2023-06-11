import type { Component } from "./component";

export type System = (components: Component[], dt: number) => void;
