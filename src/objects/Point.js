import Vector from "../math/Vector.js";

export default class Point {
    /**
     * @type {number}
     */
    radius = 5;

    /**
     * @param {Vector|number[]|...number} pos
     */
    constructor(...args) {
        if (Vector.isVector(args[0])) {
            this.pos = args[0];
        } else if (Array.isArray(args[0])) {
            this.pos = new Vector(args[0]);
        } else {
            this.pos = new Vector(args);
        }
        this.pos.columns[2] = this.pos.columns[2] ?? 0;
    }

    set x(val) {
        this.pos.columns[0] = val;
    }
    get x() {
        return this.pos.columns[0];
    }
    set y(val) {
        this.pos.columns[1] = val;
    }
    get y() {
        return this.pos.columns[1];
    }
    set z(val) {
        this.pos.columns[2] = val;
    }
    get z() {
        return this.pos.columns[2];
    }
    get path() {
        return [["begin"], ["arc", [this.pos, this.radius, 0, Math.PI * 2]], ["close"], ["fill"]];
    }
}
