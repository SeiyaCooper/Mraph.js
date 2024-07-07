import Matrix from "../math/Matrix.js";
import * as VECTORS from "../constants/vectors.js";
import Vector from "../math/Vector.js";

export default class Node {
    /**
     * @type {Node | undefined}
     */
    parent = undefined;

    /**
     * A set of children
     * @type {Node[]}
     */
    children = [];

    /**
     * local matrix
     * @type {Matrix}
     */
    localMatrix = Matrix.identity(4);

    /**
     * global matrix
     * @type {Matrix}
     */
    matrix = Matrix.identity(4);

    /**
     * @type {Vector}
     */
    center = VECTORS.ORIGIN.clone();

    /**
     * @type {Vector}
     */
    rotation = VECTORS.ORIGIN.clone();

    /**
     * @type {Vector}
     */
    scale = Vector.fromRow(3, 1);

    /**
     * @param  {...Node} objs
     */
    add(...objs) {
        this.children.push(...objs);
        objs.forEach((obj) => {
            obj.parent = this;
        });
    }

    /**
     * @param  {...Node} objs
     */
    delete(...objs) {
        objs.forEach((obj) => {
            obj.parent = undefined;
            this.children.splice(this.children.indexOf(obj), 1);
        });
    }

    /**
     * delete all children
     */
    clear() {
        this.delete(...this.children);
    }

    /**
     * Set attributes for all children
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        this[key] = value;

        for (let child of this.children) {
            child.set(key, value);
        }
    }

    /**
     * update local matrix
     * @returns {this}
     */
    updateLocalMatrix() {
        const rotation = this.rotation;
        this.localMatrix = Matrix.scale(...this.scale)
            .trans(Matrix.rotateX(rotation[0]))
            .trans(Matrix.rotateY(rotation[1]))
            .trans(Matrix.rotateZ(rotation[2]))
            .trans(Matrix.translation(...this.center));
        return this;
    }

    /**
     * update global matrix
     * @returns {this}
     */
    updateWorldMatrix() {
        if (this.parent) {
            this.matrix = this.localMatrix.trans(this.parent.matrix);
        } else {
            this.matrix = this.localMatrix;
        }
        return this;
    }

    /**
     * update local matrix, global matrix and children's matrices
     * @returns {this}
     */
    updateMatrix() {
        this.updateLocalMatrix();
        this.updateWorldMatrix();

        for (let child of this.children) {
            child.updateMatrix();
        }
        return this;
    }

    /**
     * A collection of animation methods
     */
    animate = {
        /**
         * Shifts this node to a new place
         * @param {Vector | number[]} pos
         * @param {Object} config
         */
        moveTo: ((pos, { runTime = 1, ...configs } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.center;
                },
                update: (p) => {
                    this.center = start.lerp(pos, p);
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Resets the scale factor of this node
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        scaleTo: ((factor, { runTime = 1, ...configs } = {}) => {
            let start, to;
            const config = {
                start: () => {
                    start = this.scale;
                    to = factor;
                },
                update: (p) => {
                    this.scale = start.lerp(to, p);
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Scales this node by a factor
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        scale: ((factor, { runTime = 1, ...configs } = {}) => {
            let start, to;
            const config = {
                start: () => {
                    start = this.scale;
                    to = this.scale.elMult(factor);
                },
                update: (p) => {
                    this.scale = start.lerp(to, p);
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this node around x axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateX: ((angle, { runTime = 1, ...configs } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.x;
                },
                update: (p) => {
                    this.rotation.x = start + p * angle;
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this node around y axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateY: ((angle, { runTime = 1, ...configs } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.y;
                },
                update: (p) => {
                    this.rotation.y = start + p * angle;
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this node around z axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateZ: ((angle, { runTime = 1, ...configs } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.z;
                },
                update: (p) => {
                    this.rotation.z = start + p * angle;
                    this.updateMatrix();
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),
    };
}
