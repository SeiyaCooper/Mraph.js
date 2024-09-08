import Animation from "../Animation.js";
import Event from "../Event.js";
import * as MathFunc from "../../math/math_func.js";

export default class ShowCreation extends Animation {
    /**
     * @param {Mobject} target
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, { runTime = 1.5, ...configs } = {}) {
        super();

        if (target.needsUpdate) {
            target.update();
            target.needsUpdate = false;
        }

        let completedShape = { self: [] };

        const config = {
            start: () => {
                completedShape.self = target.toMorphable();
            },
            update: (p) => {
                target.fromMorphable(generatePartialShape(completedShape.self, p));
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
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
