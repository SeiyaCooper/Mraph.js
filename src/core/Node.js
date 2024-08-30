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
     * @type {boolean}
     */
    needsUpdateMatrix = true;

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
}
