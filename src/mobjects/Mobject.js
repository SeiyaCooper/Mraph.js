import Vector from "../math/Vector.js";
import * as MathFunc from "../math/math_func.js";
import Geometry from "../geometry/Geometry.js";
import BasicMaterial from "../material/BasicMaterial.js";
import Complex from "../math/Complex.js";

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
     * Converts a specific attribute into a 2D array representation.
     * Each inner array represents the attribute values for a single vertex.
     * @returns {number[][]}
     */
    attr2Array(name) {
        const vertices = this.getAttributeVal(name);
        const size = this.attributes.get(name).size;
        const out = [];
        let compact = [];

        for (let i = 0; i < vertices.length; i += size) {
            for (let j = 0; j < size; j++) {
                compact.push(vertices[i + j]);
            }
            out.push(compact);
            compact = [];
        }

        return out;
    }

    /**
     * Converts a 2d array to an attribute.
     * @param {string} name
     * @param {number[][]} source
     */
    array2Attr(name, source) {
        this.setAttribute(name, source.flat(1), source[0].length);
    }

    /**
     * Transforms this mobject by a matrix instantly.
     * @param {Matrix} matrix
     * @param {number} [n=3]
     */
    matrixTransform(matrix, n = 3) {
        const from = this.getPoints();
        const to = [];

        for (let point of from) {
            if (n === 3) {
                to.push(Vector.fromArray(point).trans(matrix));
            } else {
                to.push(Vector.fromArray(point).resize(4, 1).trans(matrix).resize(3));
            }
        }

        this.fromPoints(to);
    }

    /**
     * A collection of animation methods
     */
    animate = {
        ...this.animate,

        /**
         * Applies a non-linear transform
         * @param {Function} trans
         * @param {Object} config
         */
        pointwiseTransform: ((trans, { runTime = 1, ...configs } = {}) => {
            let from = [],
                to = [];
            const config = {
                start: () => {
                    from = this.getPoints();
                    for (let point of from) {
                        to.push(...trans(Vector.fromArray(point)));
                    }
                    from = from.flat(1);
                },
                update: (p) => {
                    this.setAttribute("position", MathFunc.lerpArray(from, to, p), 3);
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Applies a complex function
         * @param {Function} trans
         * @param {Object} config
         */
        complexFuncTransform: ((trans, { runTime = 1, ...configs } = {}) => {
            const handler = (pos) => {
                return [...trans(Complex.fromArray(pos)), 0];
            };
            this.animate.pointwiseTransform(handler, { runTime, ...configs });
        }).bind(this),

        /**
         * Transforms to a given points array.
         * Each point in the array should be an array of [x, y, z] coordinates.
         * @param {number[][]} points
         * @param {Object} config
         */
        fromPoints: ((points, { runTime = 1, ...configs } = {}) => {
            let start = [],
                end = [];
            const config = {
                start: () => {
                    start = this.getPoints().flat(1);
                    end = points.flat(1);
                },
                update: (p) => {
                    this.setAttribute("position", MathFunc.lerpArray(start, end, p), 3);
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),

        /**
         * Tranforms to a given mobject.
         * @param {mobject} Mobject
         * @param {Object} config
         */
        transformTo: ((mobject, { runTime = 1, ...configs } = {}) => {
            let from, to;
            let fromArray, toArray;
            const config = {
                start: () => {
                    if (mobject.needsUpdate) {
                        mobject.update();
                        mobject.needsUpdate = false;
                    }

                    to = mobject.getPoints();
                    from = this.getPoints();

                    if (to.length > from.length) {
                        from = expandPoints(from, to.length);
                    } else if (to.length < from.length) {
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
                ...configs,
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
                    out.push(points[i]);
                }

                return out;
            }
        }).bind(this),
    };

    static fromGeometry(geometry) {
        const newMobject = new Mobject();

        if (geometry.needsUpdate) {
            geometry.update();
        }

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
