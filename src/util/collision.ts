import { type Vector2D, Vector } from "./vector";
import { Matrix } from "./matrix";
import type { Restitution } from "../ecs/physics/restitution";
import type { Velocity } from "../ecs/physics/velocity";
import type { Position } from "../ecs/render/position";
import type { Mass } from "../ecs/physics/mass";
import type { RotationalVelocity } from "../ecs/physics/rotational_velocity";

export type Polygon = Vector2D[];
export type ColliderInfo = [
    Position,
    () => Polygon,
    Velocity?,
    Mass?,
    Restitution?,
    RotationalVelocity?
];

export namespace Collision {
    export function arePolygonsColliding(p1: Polygon, p2: Polygon): boolean {
        let next = 0;
        for (let current = 0; current < p1.length; current++) {
            next = current + 1;
            if (next == p1.length) next = 0;

            const vc = p1[current];
            const vn = p1[next];

            if (arePolygonAndLineColliding(p2, vc, vn)) return true;
            if (arePolygonAndPointColliding(p1, p2[0])) return true;
        }

        return false;
    }

    export function arePolygonAndLineColliding(polygon: Polygon, p1: Vector2D, p2: Vector2D): boolean {
        let next = 0;
        for (let current = 0; current < polygon.length; current++) {
            next = current + 1;
            if (next == polygon.length) next = 0;

            const p3 = polygon[current];
            const p4 = polygon[next];
            if (areLinesColliding(p1, p2, p3, p4)) return true;
        }

        return false;
    }

    export function areLinesColliding(
        [x1, y1]: Vector2D,
        [x2, y2]: Vector2D,
        [x3, y3]: Vector2D,
        [x4, y4]: Vector2D
    ): boolean {
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
    }

    export function arePolygonAndPointColliding(polygon: Polygon, [px, py]: Vector2D): boolean {
        let collision = false;

        let next = 0;
        for (let current = 0; current < polygon.length; current++) {
            next = current + 1;
            if (next == polygon.length) next = 0;

            const vc = polygon[current];
            const vn = polygon[next];
            if (((vc[1] > py && vn[1] < py) || (vc[1] < py && vn[1] > py)) &&
                (px < (vn[0] - vc[0]) * (py - vc[1]) / (vn[1] - vc[1]) + vc[0])) {
                collision = !collision;
            }
        }

        return collision;
    }

    export function linesCollisionPoint(
        [x1, y1]: Vector2D,
        [x2, y2]: Vector2D,
        [x3, y3]: Vector2D,
        [x4, y4]: Vector2D
    ): Vector2D {
        const slope1 = (y2 - y1) / (x2 - x1);
        if (slope1 == Infinity || slope1 == -Infinity) {
            const slope2 = (y4 - y3) / (x4 - x3);
            if (slope2 == Infinity || slope2 == -Infinity) return [Infinity, Infinity];
            const intercept2 = y3 - x3 * slope2;
            const x = x1;
            const y = x * slope2 + intercept2;
            return [x, y];
        }
        const intercept1 = y1 - x1 * slope1;
        const slope2 = (y4 - y3) / (x4 - x3);
        if (slope2 == Infinity || slope2 == -Infinity) {
            const x = x3;
            const y = x * slope1 + intercept1;
            return [x, y];
        }
        const intercept2 = y3 - x3 * slope2;
        const x = (intercept2 - intercept1) / (slope1 - slope2);
        const y = x * slope1 + intercept1;
        return [x, y];
    }


    export function normalOfCollision(
        o1: [Position, Polygon],
        o2: [Position, Polygon]
    ): Vector2D {
        const overlap: Polygon = [];
        const c1 = o1[0].pos;
        const p1 = o1[1];
        const c2 = o2[0].pos;
        const p2 = o2[1];

        for (let current1 = 0; current1 < p1.length; current1++) {
            let next = current1 + 1;
            if (next == p1.length) next = 0;

            const vc1 = p1[current1];
            const vn1 = p1[next];

            for (let current2 = 0; current2 < p2.length; current2++) {
                let next2 = current2 + 1;
                if (next2 == p2.length) next2 = 0;

                const vc2 = p2[current2];
                const vn2 = p2[next2];

                if (!areLinesColliding(vc1, vn1, vc2, vn2)) continue;
                const intersection = linesCollisionPoint(vc1, vn1, vc2, vn2);
                overlap.push(intersection);
            }
        }

        try {
            return Vector.normalize(Vector.snap(
                Vector.subtract(c2, c1),
                Vector.normal(Vector.subtract(
                    overlap[0],
                    overlap[overlap.length - 1]
                )),
                Vector.normal(Vector.subtract(
                    overlap[overlap.length - 1],
                    overlap[0]
                ))
            ));
        } catch {
            return Vector.random();
        }
    }

    export function pointOfCollision(
        p1: Polygon,
        p2: Polygon
    ): Vector2D {
        let total: Vector2D = Vector.zero();

        for (let current1 = 0; current1 < p1.length; current1++) {
            let next = current1 + 1;
            if (next == p1.length) next = 0;

            const vc1 = p1[current1];
            const vn1 = p1[next];

            for (let current2 = 0; current2 < p2.length; current2++) {
                let next2 = current2 + 1;
                if (next2 == p2.length) next2 = 0;

                const vc2 = p2[current2];
                const vn2 = p2[next2];

                if (!areLinesColliding(vc1, vn1, vc2, vn2)) continue;
                const intersection = linesCollisionPoint(vc1, vn1, vc2, vn2);
                total = Vector.add(total, intersection);
            }
        }

        return Vector.scale(total, 1 / total.length);
    }

    /**
     * @param {Polygon} polygon - Must be CENTERED at (0, 0)!
     * */
    export function momentOfInertia(polygon: Polygon, mass: number): number {
        const N = polygon.length;

        let numerator = 0;
        let denominator = 0;
        for (let n = 1; n <= N; n++) {
            numerator += Matrix.det([polygon[(n + 1) % N], polygon[n % N]]) * (
                Vector.dot(polygon[n % N], polygon[n % N]) +
                Vector.dot(polygon[n % N], polygon[(n + 1) % N]) +
                Vector.dot(polygon[(n + 1) % N], polygon[(n + 1) % N])
            );

            denominator += 6 * Matrix.det([polygon[(n + 1) % N], polygon[n % N]]);
        }

        return mass * numerator / denominator;
    }

    /**
     * @param {Vector2D} normal - MUST BE NORMALIZED!
     */
    export function resolveCollision(
        c1: ColliderInfo,
        c2: ColliderInfo,
        normal: Vector2D,
        collisionPoint: Vector2D
    ): void {
        const pos1 = c1[0];
        const polygonGenerator1 = c1[1];
        const polygon1 = polygonGenerator1()
            .map(point => Vector.subtract(point, pos1.pos));
        const vel1 = c1[2];
        const mass1 = c1[3];
        const restitution1 = c1[4];
        const rotationalVel1 = c1[5];
        const inertia1 = momentOfInertia(polygon1, mass1 ? mass1.mass : Infinity);

        const pos2 = c2[0];
        const polygonGenerator2 = c2[1];
        const polygon2 = polygonGenerator2()
            .map(point => Vector.subtract(point, pos2.pos));
        const vel2 = c2[2];
        const mass2 = c2[3];
        const restitution2 = c2[4];
        const rotationalVel2 = c2[5];
        const inertia2 = momentOfInertia(polygon2, mass2 ? mass2.mass : Infinity);

        if (!(vel1 || vel2)) return;
        while (arePolygonsColliding(polygonGenerator1(), polygonGenerator2())) {
            if (vel1) pos1.pos = Vector.add(pos1.pos, Vector.scale(normal, 1 / (mass1 ? mass1.mass : Infinity)));
            if (vel2) pos2.pos = Vector.add(pos2.pos, Vector.scale(normal, -1 / (mass2 ? mass2.mass : Infinity)));
        }

        const collisionRestitution = Math.min(
            restitution1 ? restitution1.restitution : 0,
            restitution2 ? restitution2.restitution : 0
        );

        const collisionArm1 = Vector.subtract(collisionPoint, c1[0].pos);
        const pointVelocity1: Vector2D = rotationalVel1 ?
            Vector.scale(Vector.normal(collisionArm1), rotationalVel1.vel)
            : [0, 0];
        const closingVel1 = (vel1) ? Vector.add(vel1.vel, pointVelocity1) : pointVelocity1;

        const collisionArm2 = Vector.subtract(collisionPoint, c2[0].pos);
        const pointVelocity2: Vector2D = rotationalVel2 ?
            Vector.scale(Vector.normal(collisionArm2), rotationalVel2.vel)
            : [0, 0];
        const closingVel2 = (vel2) ? Vector.add(vel2.vel, pointVelocity2) : pointVelocity2;

        const relativeVelocity = Vector.subtract(
            closingVel1,
            closingVel2
        );

        const invertedMasses = (1 / (mass1 ? mass1.mass : Infinity)) +
            (1 / (mass2 ? mass2.mass : Infinity));
        const angularInertia =
            (
                Matrix.det([collisionArm1, normal]) *
                Matrix.det([collisionArm1, normal]) /
                inertia1
            ) + (
                Matrix.det([collisionArm2, normal]) *
                Matrix.det([collisionArm2, normal]) /
                inertia2
            );
        const sepVel = Vector.dot(relativeVelocity, normal);
        const newSepVel = -sepVel * collisionRestitution;
        const velocitySeperateDifference = newSepVel - sepVel;
        const impulseMagnitude = velocitySeperateDifference /
            (invertedMasses + angularInertia);

        const jN = Vector.scale(normal, impulseMagnitude);
        if (vel1) {
            vel1.vel = Vector.add(
                vel1.vel,
                Vector.scale(jN, 1 / (mass1 ? mass1.mass : Infinity))
            );
        }
        if (rotationalVel1) {
            rotationalVel1.vel += Matrix.det([collisionArm1, jN]) / inertia1;
        }

        if (vel2) {
            vel2.vel = Vector.add(
                vel2.vel,
                Vector.scale(jN, -1 / (mass2 ? mass2.mass : Infinity))
            );
        }
        if (rotationalVel2) {
            rotationalVel2.vel -= Matrix.det([collisionArm2, jN]) / inertia2;
        }
    }
}
