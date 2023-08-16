import Graph from "./Graph.js";
import Vector from "../math/Vector.js";

export default class Point extends Graph {
    fillColor = "black";
    _v = new Vector([0, 0, 0, 0]);
    _a = new Vector([0, 0, 0, 0]);

    /**
     * @param {Vector|number[]|...number} pos
     */
    constructor(...args) {
        super();
        if (Vector.isVector(args[0])) {
            this.pos = args[0];
        } else if (Array.isArray(args[0])) {
            this.pos = new Vector(args[0]);
        } else {
            this.pos = new Vector(args);
        }
        this.pos.columns[2] = this.pos.columns[2] ?? 0;
        this.pos.columns[3] = this.pos.columns[3] ?? 1;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        const renderer = this.renderer;
        renderer.style(this);
        renderer.begin();
        renderer.arc2D(this.pos, this.size, 0, Math.PI * 2);
        renderer.stroke();
        renderer.fill();

        return this;
    }

    set v(val) {
        const velo = this._v;
        this._v = val;
        if (velo.length !== 0) return;

        let lastTime = 0;
        this.layer.actionList.add(0, Infinity, {
            update: (_, elapsedTime) => {
                this.pos = this.pos.add(
                    this._v.mult((elapsedTime - lastTime) / 1000)
                );
                lastTime = elapsedTime;
            },
        });
    }

    get v() {
        return this._v;
    }

    set a(val) {
        const acce = this._a;
        this._a = val;
        if (acce.length !== 0) return;

        let lastTime = 0;
        this.layer.actionList.add(0, Infinity, {
            update: (_, elapsedTime) => {
                this.v = this._v.add(
                    this._a.mult((elapsedTime - lastTime) / 1000)
                );
                lastTime = elapsedTime;
            },
        });
    }

    get a() {
        return this._a;
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

    set w(val) {
        this.pos.columns[3] = val;
    }

    get w() {
        return this.pos.columns[3];
    }
}
