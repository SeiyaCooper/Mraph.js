import Node from "../core/Node.js";
import * as GLENUM from "../constants/glenum.js";

export default class Geometry extends Node {
    /**
     * attribute variables
     * @type {Object}
     */
    attributes = {};

    /**
     * uniform variables
     * @type {Object}
     */
    uniforms = {};

    /**
     * @type {number}
     */
    glMode = GLENUM.TRIANGLES;

    /**
     * @type {number | Object}
     */
    indices = 0;

    /**
     * @type {boolean}
     */
    needsUpdate = true;

    /**
     * Update variables.
     * Every geometry should have this method,
     * so that it can be updated when needed.
     */
    update() {}

    /**
     * Merge all children into this geometry.
     * This method assumes all children have and only have three variables, normal, position and color.
     */
    combineChildren() {
        const vertices = this.getAttributeVal("position");
        const colors = this.getAttributeVal("color");
        const normal = this.getAttributeVal("normal");

        for (let child of this.children) {
            const position = child.getAttributeVal("position");
            const oriColors = child.getAttributeVal("color");
            const oriNormal = child.getAttributeVal("normal");

            if (Array.isArray(child.indices)) {
                for (let i of child.indices) {
                    vertices.push(position[i * 3]);
                    vertices.push(position[i * 3 + 1]);
                    vertices.push(position[i * 3 + 2]);
                    colors.push(oriColors[i * 4]);
                    colors.push(oriColors[i * 4 + 1]);
                    colors.push(oriColors[i * 4 + 2]);
                    colors.push(oriColors[i * 4 + 3]);
                    normal.push(oriNormal[i * 3]);
                    normal.push(oriNormal[i * 3 + 1]);
                    normal.push(oriNormal[i * 3 + 2]);
                }
            } else {
                vertices.push(...position);
                colors.push(...oriColors);
                normal.push(...oriNormal);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setAttribute("normal", normal, 3);
        this.setIndex(vertices.length / 3);
        this.clear();
        return this;
    }

    /**
     * Merge from another geometry.
     * @param {Geometry} geometry
     * @param {object} config
     * An object used to define following parameters, optional
     * * mergeVertices {boolean} wheather to merge vertices array.
     * * mergeNormals {boolean} wheather to merge normals array.
     * * mergeColors{boolean} wheather to merge colors array.
     * @returns
     */
    merge(
        geometry,
        { mergeVertices = true, mergeNormals = true, mergeColors = true } = {}
    ) {
        if (mergeVertices) this.mergeVertices(geometry);
        if (mergeNormals) this.mergeNormals(geometry);
        if (mergeColors) this.mergeColors(geometry);
        return geometry;
    }

    /**
     * Merge vertices array into this geometry from another.
     * @param {Geometry} geometry
     * @returns {this}
     */
    mergeVertices(geometry) {
        const vertices = this.getAttributeVal("position");
        const source = geometry.getAttributeVal("position");

        if (Array.isArray(geometry.indices)) {
            for (let i of geometry.indices) {
                vertices.push(source[i * 3]);
                vertices.push(source[i * 3 + 1]);
                vertices.push(source[i * 3 + 2]);
            }
        } else {
            vertices.push(...source);
        }

        this.setAttribute("position", vertices, 3);
        return this;
    }

    /**
     * Merge colors array into this geometry from another.
     * @param {Geometry} geometry
     * @returns {this}
     */
    mergeColors(geometry) {
        const target = this.getAttributeVal("color");
        const source = geometry.getAttributeVal("color");

        if (Array.isArray(geometry.indices)) {
            for (let i of geometry.indices) {
                target.push(source[i * 4]);
                target.push(source[i * 4 + 1]);
                target.push(source[i * 4 + 2]);
                target.push(source[i * 4 + 3]);
            }
        } else {
            target.push(...source);
        }

        this.setAttribute("color", target, 4);
        return this;
    }

    /**
     * Merge normals array into this geometry from another.
     * @param {Geometry} geometry
     * @returns {this}
     */
    mergeNormals(geometry) {
        const target = this.getAttributeVal("normal");
        const source = geometry.getAttributeVal("normal");

        if (Array.isArray(geometry.indices)) {
            for (let i of geometry.indices) {
                target.push(source[i * 3]);
                target.push(source[i * 3 + 1]);
                target.push(source[i * 3 + 2]);
            }
        } else {
            target.push(...source);
        }

        this.setAttribute("normal", target, 3);
        return this;
    }

    /**
     * Set value of a single attribute variable
     * @param {string} name
     * @param {number[]} data
     * @param {number} n
     */
    setAttribute(name, data, n) {
        const attr = this.attributes[name] ?? {};
        attr.data = data;
        attr.n = n ?? attr.n;
        attr.needsUpdate = true;

        if (!this.attributes[name]) this.attributes[name] = attr;
    }

    /**
     * Get value of a single attribute variable
     * @param {string} name
     * @param {number[]} data
     * @param {number} n
     */
    getAttributeVal(name) {
        return this.attributes[name]?.data ?? [];
    }

    /**
     * set index
     * @param {number | number[]} data
     */
    setIndex(data) {
        this.indices = data;
    }
}
