import * as MathFunc from "../../math/math_func.js";

/**
 * @param {Mobject} target
 * @param {object} [configs={}] - your personal configurations of the event.
 */
export default function ShowCreation(target, { ...configs } = {}) {
    let completedShape = { self: [] };

    return {
        onStart: () => {
            completedShape.self = target.toMorphable();
        },
        onUpdate: (p) => {
            target.fromMorphable(generatePartialShape(completedShape.self, p));
        },
        ...configs,
    };
}

function generatePartialShape(completed, alpha) {
    const partialShape = [];
    completed.forEach((path) => {
        partialShape.push(generatePartialPath(path, alpha));
    });
    return partialShape;
}

function generatePartialPath(completed, alpha) {
    const pointsNum = completed.length - 1;
    const fromIndex = Math.min(Math.floor(pointsNum * alpha), completed.length - 2);
    const toIndex = fromIndex + 1;

    const partialPath = [];

    for (let i = 0; i < fromIndex + 1; i++) {
        partialPath.push(completed[i]);
    }

    partialPath.push(MathFunc.lerpArray(completed[fromIndex], completed[toIndex], pointsNum * alpha - fromIndex));
    return partialPath;
}
