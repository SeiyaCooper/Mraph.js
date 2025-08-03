/**
 * Shifts this node to a new place
 * @param {Node} target
 * @param {Vector} pos
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function MoveTo(target, pos, { ...configs } = {}) {
    let start;
    return {
        onStart: () => {
            start = target.center;
        },
        onUpdate: (p) => {
            target.center = start.lerp(pos, p);
            target.updateMatrix();
        },
        ...configs,
    };
}

/**
 * Scales this node by a scale factor.
 * @param {Node} target
 * @param {number} factor
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function ScaleBy(target, factor, { ...configs } = {}) {
    let start, to;
    return {
        onStart: () => {
            start = target.scale;
            to = start.elMult(factor);
        },
        onUpdate: (p) => {
            target.scale = start.lerp(to, p);
            target.updateMatrix();
        },
        ...configs,
    };
}

/**
 * Resets the scale factor of this node.
 * @param {Node} target
 * @param {number} factor
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function ScaleTo(target, factor, { ...configs } = {}) {
    let start, to;
    return {
        onStart: () => {
            start = target.scale;
            to = factor;
        },
        onUpdate: (p) => {
            target.scale = start.lerp(to, p);
            target.updateMatrix();
        },
        ...configs,
    };
}

/**
 * Rotates this node around x axis
 * @param {Node} target
 * @param {number} angle
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function RotateX(target, angle, { ...configs } = {}) {
    let start;
    return {
        onStart: () => {
            start = target.rotation.x;
        },
        onUpdate: (p) => {
            target.rotation.x = start + p * angle;
            target.updateMatrix();
        },
        ...configs,
    };
}

/**
 * Rotates this node around y axis
 * @param {Node} target
 * @param {number} angle
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function RotateY(target, angle, { ...configs } = {}) {
    let start;
    return {
        onStart: () => {
            start = target.rotation.y;
        },
        onUpdate: (p) => {
            target.rotation.y = start + p * angle;
            target.updateMatrix();
        },
        ...configs,
    };
}

/**
 * Rotates this node around z axis
 * @param {Node} target
 * @param {number} angle
 * @param {object} [configs={}] - your personal configurations of the action.
 */
export function RotateZ(target, angle, { ...configs } = {}) {
    let start;
    return {
        onStart: () => {
            start = target.rotation.z;
        },
        onUpdate: (p) => {
            target.rotation.z = start + p * angle;
            target.updateMatrix();
        },
        ...configs,
    };
}
