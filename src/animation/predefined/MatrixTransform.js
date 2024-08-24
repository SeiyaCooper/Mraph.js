import PointwiseTransform from "./PointwiseTransform.js";

export default class MatrixTransform extends PointwiseTransform {
    /**
     * @param {Node} target
     * @param {Matrix} matrix - matrix to transform by，can be in 2*2 or 3*3
     * @param {object} [configs={}] - your personal configurations of the evnet.
     */
    constructor(target, matrix, configs) {
        super(
            target,
            (pos) => {
                if (matrix.column === 2) {
                    matrix = matrix.resize(3, 3, 0);
                    matrix[2][2] = 1;
                }

                return pos.trans(matrix);
            },
            configs
        );
    }
}
