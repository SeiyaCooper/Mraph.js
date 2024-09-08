import Animation from "../Animation.js";
import Event from "../Event.js";

/**
 * Shifts this node to a new place
 */
export class MoveTo extends Animation {
    /**
     * @param {Node} target
     * @param {Vector} pos
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, pos, { runTime = 1, ...configs } = {}) {
        super();

        let start;
        const config = {
            start: () => {
                start = target.center;
            },
            update: (p) => {
                target.center = start.lerp(pos, p);
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

/**
 * Scales this node by a scale factor.
 */
export class ScaleBy extends Animation {
    /**
     * @param {Node} target
     * @param {number} factor
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, factor, { runTime = 1, ...configs } = {}) {
        super();

        let start, to;
        const config = {
            start: () => {
                start = target.scale;
                to = this.scale.elMult(factor);
            },
            update: (p) => {
                target.scale = start.lerp(to, p);
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

/**
 * Resets the scale factor of this node.
 */
export class ScaleTo extends Animation {
    /**
     * @param {Node} target
     * @param {number} factor
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, factor, { runTime = 1, ...configs } = {}) {
        super();

        let start, to;
        const config = {
            start: () => {
                start = target.scale;
                to = factor;
            },
            update: (p) => {
                target.scale = start.lerp(to, p);
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

/**
 * Rotates this node around x axis
 */
export class RotateX extends Animation {
    /**
     * @param {Node} target
     * @param {number} angle
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, angle, { runTime = 1, ...configs } = {}) {
        super();

        let start;
        const config = {
            start: () => {
                start = target.rotation.x;
            },
            update: (p) => {
                target.rotation.x = start + p * angle;
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

/**
 * Rotates this node around y axis
 */
export class RotateY extends Animation {
    /**
     * @param {Node} target
     * @param {number} angle
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, angle, { runTime = 1, ...configs } = {}) {
        super();

        let start;
        const config = {
            start: () => {
                start = target.rotation.y;
            },
            update: (p) => {
                target.rotation.y = start + p * angle;
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

/**
 * Rotates this node around z axis
 */
export class RotateZ extends Animation {
    /**
     * @param {Node} target
     * @param {number} angle
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, angle, { runTime = 1, ...configs } = {}) {
        super();

        let start;
        const config = {
            start: () => {
                start = target.rotation.z;
            },
            update: (p) => {
                target.rotation.z = start + p * angle;
                target.updateMatrix();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}
