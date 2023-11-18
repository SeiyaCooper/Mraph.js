import Point from "./Point.js";
import Graph2D from "../Graph2D.js";

export default class Segment extends Graph2D {
    indices = { data: [0, 1, 3, 2, 0, 3] };
    tips = [];
    tipWidth = 0.2;

    constructor(start = new Point(-1, 0), end = new Point(1, 0)) {
        super();
        this.start = start;
        this.end = end;
    }

    update() {
        const start = this.start.center;
        const end = this.end.center;
        const vec = end.reduce(start).trans(this.rot90OnNorVec);
        vec.norm = this.strokeWidth / 2;

        const vertices = [
            start.add(vec),
            start.reduce(vec),
            end.add(vec),
            end.reduce(vec),
        ].flat(2);

        this.attributes.position.data = vertices;

        const color = [];
        for (let i = 0; i <= vertices.length / 3; i++) {
            color.push(...this.strokeColor);
        }
        this.attributes.color.data = color;
    }

    at(p) {
        return this.start.center.add(this.vector.mult(p));
    }

    addTip(at, reverse = false) {
        this.tips.push([at, reverse]);
    }

    set vector(vec) {
        this.end = new Point(this.start.center.add(vec));
    }

    get vector() {
        return this.end.center.reduce(this.start.center);
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
