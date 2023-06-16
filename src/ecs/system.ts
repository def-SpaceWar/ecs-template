import type { Scene } from "../util/scene_manager";

export type System = (scene: Scene, dt: number) => void;
