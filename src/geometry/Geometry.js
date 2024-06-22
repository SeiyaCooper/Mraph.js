import Node from "../core/Node.js";
import * as DrawModes from "../constants/draw_modes.js";

export default class Geometry extends Node {
    /**
     * Name of this geometry, optional.
     */
    name = "";

    /**
     * A set of attribute variables
     * @type {Object}
     */
    attributes = new Map();

    /**
     * Uniform variables
     * @type {Object}
     */
    uniforms = new Map();

    /**
     * @type {number}
     */
    mode = DrawModes.TRIANGLES;

    /**
     * @type {Object}
     */
    indices = {
        data: 0,
        needsUpdate: false,
    };

    /**
     * @type {boolean}
     */
    visible = true;

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

            if (Array.isArray(child.indices.data)) {
                for (let i of child.indices.data) {
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
     * Set value of an attribute variable
     * @param {string} name
     * @param {number[]} data
     * @param {number} [size]
     */
    setAttribute(name, data, size) {
        const attrs = this.attributes;

        if (attrs.has(name)) {
            const attr = attrs.get(name);
            attr.data = data;
            attr.size = size ?? attr.size;
            attr.needsUpdate = true;
        } else {
            const attr = { data, size, needsUpdate: true };
            attrs.set(name, attr);
        }
    }

    /**
     * Delete an attribute
     * @param {string} name
     */
    deleteAttribute(name) {
        if (!this.attributes.has(name)) return;

        this.attributes.delete(name);
    }

    /**
     * Get value of an attribute variable
     * @param {string} name
     * @param {number[]} data
     * @param {number} n
     */
    getAttributeVal(name) {
        return this.attributes.get(name)?.data ?? [];
    }

    /**
     * Sets a uniform variable
     * @param {string} name
     * @param {number[] | number} data
     * @param {number} size
     */
    setUniform(name, data, size) {
        this.uniforms.set(name, { data, size });
    }

    /**
     * Deletes a uniform variable
     * @param {string} name
     */
    deleteUniform(name) {
        this.uniforms.delete(name);
    }

    /**
     * Gets value of a uniform variable
     * @param {string} name
     * @returns {number[] | number}
     */
    getUniformVal(name) {
        return this.uniforms.get(name).data;
    }

    /**
     * Sets index
     * @param {number | number[]} data
     */
    setIndex(data) {
        this.indices.data = data;
        this.indices.needsUpdate = true;
    }

    /**
     * Gets index
     * @param {number | number[]} data
     */
    getIndex() {
        return this.indices.data;
    }
}
