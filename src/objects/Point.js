import Vector from "../math/Vector.js";

export default class Point {
    constructor(...args) {
        if (Vector.isVector(args[0])) {
            const pos = args[0];
            this.pos = pos;
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
}
