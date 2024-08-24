import Vector from "../math/Vector.js";
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
     * Transform into an array that is morphable, in order to perform morph animations.
     * This method should be overridden when inherited.
     */
    toMorphable() {}

    /**
     * Sets attribute variables from a given morphable array, in order to perform morph animations.
     * This method should be overridden when inherited.
     */
    fromMorphable() {}

    /**
     * @type {Layer}
     */
    set layer(val) {
        this._layer = val;
    }

    /**
     * @type {Layer}
     */
    get layer() {
        return this._layer;
    }

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

        newMobject.material.colorMode = "single";
        if (geometry.material) newMobject.material = geometry.material;

        return newMobject;
    }
}
