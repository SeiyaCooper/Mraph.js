import Vector from "../math/Vector.js";
import * as MathFunc from "../math/math_func.js";
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

        if (Array.isArray(source.indices.data)) {
            for (let i of source.indices.data) {
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
     * Returns an array of points where each point is represented as an array of its coordinates [x, y, z].
     * @returns {number[][]}
     */
    getPoints() {
        const vertices = this.getAttributeVal("position");
        const points = [];

        for (let i = 0; i < vertices.length; i += 3) {
            points.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
        }

        return points;
    }

    /**
     * Replaces the geometry's vertex data with the provided points array.
     * Each point in the array should be an array of [x, y, z] coordinates.
     * @param {number[][]} points
     */
    fromPoints(points) {
        this.setAttribute("position", points.flat(1), 3);
        this.setIndex(this.getAttributeVal("position").length / 3);
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

        /**
         * Applies a non-linear transform
         * @param {Function} trans
         * @param {Object} config
         */
        pointwiseTransfrom: ((trans, { runTime = 1, curve } = {}) => {
            let from = [],
                to = [];
            const config = {
                start: () => {
                    from = this.getPoints();
                    for (let point of from) {
                        to.push(trans(Vector.fromArray(point)));
                    }
                },
                update: (p) => {
                    const now = [];

                    for (let i = 0; i < from.length; i++) {
                        now.push(MathFunc.lerpArray(from[i], to[i], p));
                    }

                    this.fromPoints(now);
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Transform to a given points array.
         * Each point in the array should be an array of [x, y, z] coordinates.
         * @param {number[][]} points
         * @param {Object} config
         */
        fromPoints: ((points, { runTime = 1, curve } = {}) => {
            let start = [];
            const config = {
                start: () => {
                    start = this.getPoints();
                },
                update: (p) => {
                    const now = [];

                    for (let i = 0; i < start.length; i++) {
                        now.push(MathFunc.lerpArray(start[i], points[i], p));
                    }

                    this.fromPoints(now);
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Tranform to a given mobject.
         * @param {mobject} Mobject
         * @param {Object} config
         */
        transformTo: ((mobject, { runTime = 1, curve } = {}) => {
            let from, to;
            let fromArray, toArray;
            const config = {
                start: () => {
                    to = mobject.getPoints();
                    from = this.getPoints();

                    if (to.length === from.length) return;
                    if (to.length > from.length) {
                        from = expandPoints(from, to.length);
                    } else {
                        to = expandPoints(to, from.length);
                    }

                    fromArray = from.flat(1);
                    toArray = to.flat(1);
                },
                update: (p) => {
                    const now = MathFunc.lerpArray(fromArray, toArray, p);
                    this.setAttribute("position", now, 3);
                    this.setIndex(now.length / 3);
                },
                stop: () => {
                    this.fromPoints(mobject.getPoints());
                },
                curve,
            };
            this.layer.timeline.addFollow(runTime, config);

            // helper function
            function expandPoints(points, targetLength) {
                const originLength = points.length;
                const repeatTimes = Math.floor(targetLength / originLength);
                const out = [];

                for (let i = 0; i < repeatTimes; i++) {
                    out.push(...points);
                }

                const rest = targetLength - repeatTimes * originLength;
                for (let i = 0; i < rest; i++) {
                    out.push(points[0]);
                }

                return out;
            }
        }).bind(this),
    };

    static fromGeometry(geometry) {
        const newMobject = new Mobject();

        for (let [key, value] of geometry.attributes) {
            newMobject.setAttribute(key, value.data, value.size);
        }

        newMobject.setIndex(geometry.getIndex());

        for (let child of geometry.children) {
            newMobject.add(Mobject.fromGeometry(child));
        }

        if (geometry.material) newMobject.material = geometry.material;

        return newMobject;
    }
}
