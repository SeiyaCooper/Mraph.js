import Geometry from "../geometry/Geometry.js";
import BasicMaterial from "../material/BasicMaterial.js";

export default class Mobject extends Geometry {
    /**
     * Every mobject contains a default material.
     */
    material = new BasicMaterial();

    /**
     * @returns {Mobject}
     */
    constructor() {
        super();
        this.material.colorMode = "vertex";
    }

    /**
     * Merges an attribute data from another geometry.
     * @param {Geometry} source
     * @param {string} name
     * @returns {this}
     */
    mergeAttribute(source, name) {
        const from = source.getAttributeVal(name);
        const to = this.getAttributeVal(name) ?? [];
        const size = source.attributes.get(name).size;

        if (!from) return this;

        if (Array.isArray(source.indices)) {
            for (let i of source.indices) {
                for (let j = 0; j < size; j++) {
                    to.push(from[i * size + j]);
                }
            }
        } else {
            to.push(...from);
        }

        this.setAttribute(name, to, size);

        return this;
    }

    /**
     * Merges many attribute datas from another geometry.
     * @param {Geometry} source
     * @param  {...string} names
     * @returns {this}
     */
    mergeAttributes(source, ...names) {
        for (let name of names) {
            this.mergeAttribute(source, name);
        }
        return this;
    }

    /**
     * A collection of animation methods
     */
    animate = {
        /**
         * Shifts this mobject to a new place
         * @param {Vector | number[]} pos
         * @param {Object} config
         */
        moveTo: ((pos, { runTime = 1, curve } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.center;
                },
                update: (p) => {
                    this.center = start.lerp(pos, p);
                    this.updateMatrix();
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Scales this mobject by a factor
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        scaleTo: ((factor, { runTime = 1, curve } = {}) => {
            let start, to;
            const config = {
                start: () => {
                    start = this.scale;
                    to = start.elMult(factor);
                },
                update: (p) => {
                    this.scale = start.lerp(to, p);
                    this.updateMatrix();
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this mobject around x axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateX: ((angle, { runTime = 1, curve } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.x;
                },
                update: (p) => {
                    this.rotation.x = start + p * angle;
                    this.updateMatrix();
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this mobject around y axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateY: ((angle, { runTime = 1, curve } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.y;
                },
                update: (p) => {
                    this.rotation.y = start + p * angle;
                    this.updateMatrix();
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Rotates this mobject around z axis
         * @param {Vector | number[]} factor
         * @param {Object} config
         */
        rotateZ: ((angle, { runTime = 1, curve } = {}) => {
            let start;
            const config = {
                start: () => {
                    start = this.rotation.z;
                },
                update: (p) => {
                    this.rotation.z = start + p * angle;
                    this.updateMatrix();
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),
    };
}
