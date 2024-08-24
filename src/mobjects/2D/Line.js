import Mobject2D from "./Mobject2D.js";
import Point from "./Point.js";
import Color from "../../math/Color.js";
import Matrix from "../../math/Matrix.js";

export default class Line extends Mobject2D {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    tips = [];
    tipWidth = 0.1;
    tipLength = 0.2;
    lineJoin = "none";

    /**
     * @param {Point} [start=[-1,0]]
     * @param {Point} [end=[1,0]]
     */
    constructor(start = [-1, 0], end = [1, 0]) {
        super();

        function parseToPoint(obj) {
            if (Array.isArray(obj)) {
                return new Point(...obj);
            }

            return obj;
        }

        this.start = parseToPoint(start);
        this.end = parseToPoint(end);
        this.setIndex([0, 1, 3, 2, 0, 3]);
    }

    update() {
        this.clearGraph();
        this.move(this.start.center);
        this.line(this.end.center);

        this.stroke();

        if (!this.tips.length) return this;
        const start = this.start.center;
        for (let [at, reverse] of this.tips) {
            const vec = start.add(this.vector.mult(at)).add(this.vector.normal().mult(0.05));

            this.move(vec);

            const h = this.vector;
            h.norm = this.tipLength;

            let w = h.clone();
            w.norm = this.tipWidth;
            w = w.trans(Matrix.rotateZ(Math.PI / 2, 3));

            if (reverse) {
                this.line(vec.add(h).add(w));
                this.line(vec.add(h).minus(w));
            } else {
                this.line(vec.minus(h).add(w));
                this.line(vec.minus(h).minus(w));
            }
        }
        this.fill();

        return this;
    }

    /**
     * return a position where corresponds a precent
     * @param {number} precent
     * @returns
     */
    at(p) {
        return this.start.center.add(this.vector.mult(p));
    }

    /**
     * add a tip to this line
     * @param {number} at
     * @param {Boolean} reverse
     */
    addTip(at, reverse = false) {
        this.tips.push([at, reverse]);
    }

    set vector(vec) {
        this.end = new Point(this.start.center.add(vec));
    }

    get vector() {
        return this.end.center.minus(this.start.center);
    }

    set length(val) {
        const vec = this.vector;
        vec.norm = val;
        this.vector = vec;
    }

    get length() {
        return this.vector.norm;
    }

    get slope() {
        const s = this.start.center;
        const e = this.end.center;

        return (s[1] - s[0]) / (e[1] - e[0]);
    }
}
