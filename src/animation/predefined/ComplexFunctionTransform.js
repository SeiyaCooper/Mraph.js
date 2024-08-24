import PointwiseTransform from "./PointwiseTransform.js";
import Complex from "../../math/Complex.js";

/**
 * Applies a complex function to each point in the target.
 */
export default class ComplexFunctionTransform extends PointwiseTransform {
    /**
     * @param {Node} target
     * @param {Function} complexFunction
     * @param {object} [configs={}] - your personal configurations of the evnet.
     */
    constructor(target, complexFunction, configs) {
        super(
            target,
            (pos) => {
                const complexNumber = new Complex(pos.x, pos.y);
                return [...complexFunction(complexNumber), 0.0];
            },
            configs
        );
    }
}
