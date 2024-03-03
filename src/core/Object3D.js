import Matrix from "../math/Matrix.js";

export default class Object3D {
    /**
     * @type {Geometry | undefined}
     */
    parent = undefined;

    /**
     * @type {Geometry[]}
     */
    children = [];

    /**
     * @type {Matrix}
     */
    _matrix = Matrix.identity(4);

    /**
     * @param  {...Geometry} objs
     */
    addChild(...objs) {
        this.children.push(...objs);
        objs.forEach((obj) => {
            obj.parent = this;
        });
    }

    /**
     * @param  {...Geometry} objs
     */
    deleteChild(...objs) {
        objs.forEach((obj) => {
            obj.parent = undefined;
            this.children.splice(this.children.indexOf(obj), 1);
        });
    }

    /**
     * delete all children
     */
    clearChildren() {
        this.deleteChild(...this.children);
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

    set matrix(val) {
        this._matrix = val;
    }

    get matrix() {
        if (this.parent) {
            return this.parent.matrix.mult(this._matrix);
        } else {
            return this._matrix;
        }
    }
}
