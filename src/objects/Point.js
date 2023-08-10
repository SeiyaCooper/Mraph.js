import Graph from "./Graph.js";
import Vector from "../math/Vector.js";

export default class Point extends Graph {
    fillColor = "black";
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
        renderer.arc2D(this.transPos, this.size, 0, Math.PI * 2);
        renderer.stroke();
        renderer.fill();

        return this;
    }

    /**
     * this.matrix transformed pos
     * @type {Vector}
     */
    get transPos() {
        return this.pos.trans(this.matrix);
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
