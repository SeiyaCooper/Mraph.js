import Object3D from "../core/Object3D.js";
import * as GLENUM from "../constants/glenum.js";

export default class Geometry extends Object3D {
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
     * properties to be watched so that this geometry can be updated when needed
     * @type {string[]}
     */
    watchList = [];

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
     * This method assuming all children have and only have two variables, position and color.
     */
    combineChildren() {
        const vertices = this.getAttributeVal("position");
        const colors = this.getAttributeVal("color");

        for (let child of this.children) {
            const position = child.getAttributeVal("position");
            const oriColors = child.getAttributeVal("color");

            if (typeof child.indices !== "number") {
                for (let i of child.indices.data) {
                    vertices.push(position[i * 3]);
                    vertices.push(position[i * 3 + 1]);
                    vertices.push(position[i * 3 + 2]);
                    colors.push(oriColors[i * 4]);
                    colors.push(oriColors[i * 4 + 1]);
                    colors.push(oriColors[i * 4 + 2]);
                    colors.push(oriColors[i * 4 + 3]);
                }
            } else {
                vertices.push(...position);
                colors.push(...oriColors);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setIndex(vertices.length / 3);
        this.clearChildren();
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
        if (typeof data === "number") {
            this.indices = data;
        } else {
            this.indices = { data: data };
        }
    }
}
