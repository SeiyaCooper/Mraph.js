import Vector from "../../math/Vector.js";
import Color from "../../math/Color.js";
import Arc from "./Arc.js";
import MraphError from "../../utils/MraphError.js";

export default class Point extends Arc {
    fillColor = new Color(1, 1, 1, 1);
    _v = new Vector(0, 0, 0);
    _a = new Vector(0, 0, 0);

    /**
     * @param  {Vector | number[] | ...number} position
     */
    constructor(...args) {
        super(0, 2 * Math.PI, 0.06);

        if (Vector.isInstance(args[0])) {
            this.center = args[0];
        } else if (Array.isArray(args[0])) {
            this.center = new Vector(...args[0]);
        } else {
            this.center = new Vector(...args);
        }
        this.center[2] = this.center[2] ?? 0;
    }

    update() {
        this.clearGraph();
        this.arc(this.radius, 0, Math.PI * 2, false);
        this.draw();
        return this;
    }

    draw() {
        this.fill();
        return this;
    }

    set v(val) {
        if (!this.layer) {
            MraphError.error("Layer property is undefined. Ensure that 'layer' is properly setted before setting 'v'.");
            return;
        }

        this._v = val;
        let lastTime = 0;
        this.layer.timeline.add(this.layer.timeline.current, Infinity, {
            update: (_, elapsedTime) => {
                this.center = this.center.add(this._v.mult(elapsedTime - lastTime));
                this.updateMatrix();
                lastTime = elapsedTime;
            },
            updateMax: false,
        });

        // Do not add event to timeline again
        Object.defineProperty(this, "v", {
            set: (val) => {
                this._v = val;
            },
            get: () => {
                return this._v;
            },
        });
    }

    get v() {
        return this._v;
    }

    set a(val) {
        if (!this.layer) {
            MraphError.error("Layer property is undefined. Ensure that 'layer' is properly setted before setting 'a'.");
            return;
        }

        this._a = val;
        let lastTime = 0;
        this.layer.timeline.add(this.layer.timeline.current, Infinity, {
            update: (_, elapsedTime) => {
                this.v = this._v.add(this._a.mult(elapsedTime - lastTime));
                lastTime = elapsedTime;
            },
            updateMax: false,
        });

        // Do not add event to timeline again
        Object.defineProperty(this, "a", {
            set: (val) => {
                this._a = val;
            },
            get: () => {
                return this._a;
            },
        });
    }

    get a() {
        return this._a;
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
