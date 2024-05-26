import Vector from "../../math/Vector.js";
import Mobject from "../Mobject.js";
import Sphere from "../../geometry/Sphere.js";
import * as COLORS from "../../constants/colors.js";

export default class Point3D extends Mobject {
    radius = 0.06;
    _v = new Vector(0, 0, 0);
    _a = new Vector(0, 0, 0);

    /**
     * @param  {Vector | number[] | ...number} position
     */
    constructor(...args) {
        super();

        if (Vector.isInstance(args[0])) {
            this.center = args[0];
        } else if (Array.isArray(args[0])) {
            this.center = new Vector(...args[0]);
        } else {
            this.center = new Vector(...args);
        }
        this.center[2] = this.center[2] ?? 0;

        this.material.colorMode = "single";
        this.color = COLORS.RED;
    }

    update() {
        const sphere = new Sphere({
            radius: this.radius,
            thetaSegments: 8,
            phiSegments: 16,
        });
        sphere.update();

        this.merge(sphere);
        this.setIndex(this.getAttributeVal("position").length / 3);
    }

    set color(color) {
        this.material.color = color;
    }

    get color() {
        return this.material.color;
    }

    set v(val) {
        this._v = val;
        let lastTime = 0;
        this.layer.timeline.add(this.layer.timeline.current, Infinity, {
            update: (_, elapsedTime) => {
                this.center = this.center.add(
                    this._v.mult(elapsedTime - lastTime)
                );
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
