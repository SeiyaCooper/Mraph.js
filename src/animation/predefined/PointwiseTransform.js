import Animation from "../Animation.js";
import Event from "../Event.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";

/**
 * Shifts this node to a new place
 */
export default class PointwiseTransform extends Animation {
    /**
     * @param {Node} target
     * @param {Function} transform
     * @param {object} [configs={}] - your personal configurations of the evnet.
     */
    constructor(target, transform, { runTime = 1, ...configs } = {}) {
        super();

        let from = target.toMorphable(),
            to = [];
        const config = {
            start: () => {
                console.log(from);
                for (let polygon of from) {
                    const newPlygon = [];
                    for (let point of polygon) {
                        newPlygon.push(transform(Vector.fromArray(point)));
                    }
                    to.push(newPlygon);
                }
            },
            update: (p) => {
                target.fromMorphable(MathFunc.lerpArray(from, to, p));
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}
