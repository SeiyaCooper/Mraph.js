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

        let from = [],
            to = [];
        const config = {
            start: () => {
                from = target.attr2Array("position");
                for (let point of from) {
                    to.push(...transform(Vector.fromArray(point)));
                }
                from = from.flat(1);
            },
            update: (p) => {
                target.setAttribute("position", MathFunc.lerpArray(from, to, p), 3);
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}
