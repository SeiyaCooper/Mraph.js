import Vector from "../math/Vector.js";
import Color from "../core/Color.js";
import Arc from "./Arc.js";

export default class Point extends Arc {
    fillColor = new Color(1, 1, 1, 1);
    _v = new Vector(0, 0, 0);
    _a = new Vector(0, 0, 0);

    constructor(...args) {
        super(0, 2 * Math.PI, 0.09);

        if (Vector.isVector(args[0])) {
            this.center = args[0];
        } else if (Array.isArray(args[0])) {
            this.center = new Vector(...args[0]);
        } else {
            this.center = new Vector(...args);
        }
        this.center[2] = this.center[2] ?? 0;
    }

    update() {
        this.clear();
        this.move(this.center);
        this.arc(this.radius, 0, Math.PI * 2, false);
        this.fill();
        return this;
    }

    set x(val) {
        this.center[0] = val;
    }

    get x() {
        return this.center[0];
    }

    set y(val) {
        this.center[1] = val;
    }

    get y() {
        return this.center[1];
    }

    set z(val) {
        this.center[2] = val;
    }

    get z() {
        return this.center[2];
    }
}
