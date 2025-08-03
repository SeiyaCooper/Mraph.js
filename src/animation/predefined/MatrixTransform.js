import PointwiseTransform from "./PointwiseTransform.js";

/**
 * @param {Node} target
 * @param {Matrix} matrix - matrix to transform by，can be in 2*2 or 3*3
 * @param {object} [configs={}] - your personal configurations of the event.
 */
export default function MatrixTransform(target, matrix, configs) {
    return PointwiseTransform(
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
