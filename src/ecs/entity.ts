export type Entity = number;
let id = 0;
export const totalEntities = (): number => id;
export function entity(): Entity {
    return id++;
}
