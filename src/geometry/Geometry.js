import * as DrawMode from "../constants/draw_modes.js";
import Object3D from "../core/Object3D.js";
import Matrix from "../math/Matrix.js";

export default class Geometry extends Object3D {
    /**
     * attribute variables
     * @type {Object}
     */
    attributes = {
        position: { data: [] },
    };

    /**
     * uniform variables
     * @type {Object}
     */
    uniforms = {
        modelMat: Matrix.identity(4),
    };

    /**
     * @type {number}
     */
    mode = DrawMode.TRIANGLES;

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
     * This method will only remain position variable and drop others
     */
    combineChildren() {
        const vertices = this.getAttribute("position");

        for (let child of this.children) {
            const data = child.getAttribute("position");
            if (typeof child.indices !== "number") {
                for (let i of child.indices.data) {
                    vertices.push(data[i * 3]);
                    vertices.push(data[i * 3 + 1]);
                    vertices.push(data[i * 3 + 2]);
                }
            } else {
                vertices.push(...data);
            }
        }

        this.setAttribute("position", vertices);
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
    getAttribute(name) {
        const attr = this.attributes[name].data ?? [];
        return attr;
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
