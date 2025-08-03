import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";

/**
 * Applies an non-linear transformation to the Mobject 'target'
 * @param {Mobject} target
 * @param {Function} transform
 * @param {object} [configs={}] - your personal configurations of the event.
 */
export default function PointwiseTransform(target, transform, { ...configs } = {}) {
    let fromShape = { self: [], children: [] };
    let toShape = { self: [], children: [] };

    return {
        onStart: () => {
            function transformSingle(target) {
                let from = target.toMorphable(),
                    to = [];

                if (!Array.isArray(from)) return [[], []];

                for (let polygon of from) {
                    const newPlygon = [];
                    for (let point of polygon) {
                        newPlygon.push(transform(Vector.fromArray(point)));
                    }
                    to.push(newPlygon);
                }
                return [from, to];
            }

            [fromShape.self, toShape.self] = transformSingle(target);

            for (let child of target.children) {
                const [childFrom, childTo] = transformSingle(child);
                fromShape.children.push(childFrom);
                toShape.children.push(childTo);
            }
        },
        onUpdate: (p) => {
            target.fromMorphable(MathFunc.lerpArray(fromShape.self, toShape.self, p));

            target.children.forEach((child, index) => {
                if (fromShape.children[index].length === 0) return;

                child.fromMorphable(MathFunc.lerpArray(fromShape.children[index], toShape.children[index], p));
            });
        },
        ...configs,
    };
}
