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
     * Set value of a single attribute
     * @param {string} name
     * @param {number[]} data
     * @param {number} n
     */
    setAttribute(name, data, n) {
        const attr = this.attributes[name] ?? {};
        attr.data = data;
        attr.n = n;
        attr.needsUpdate = true;

        if (!this.attributes[name]) this.attributes[name] = attr;
    }
}
