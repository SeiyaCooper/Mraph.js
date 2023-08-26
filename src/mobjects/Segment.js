import Graph from "./Graph.js";
import Matrix from "../math/Matrix.js";
import Color from "../core/Color.js";
import Point from "./Point.js";

export default class Segment extends Graph {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    indices = { data: [0, 1, 3, 2, 0, 3] };

    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    update() {
        const start = this.start.center;
        const end = this.end.center;
        const vec = end.reduce(start).trans(Matrix.rotateZ(Math.PI / 2, 3));
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

    renderByCanvas2d(renderer) {
        if (!renderer || !this.visible) return this;

        renderer.style(this);
        renderer.begin();
        renderer.move(this.start.center);
        renderer.line3D(this.end.center);
        renderer.stroke();

        return this;
    }

    set vector(vec) {
        this._vector = vec;
        this.end = new Point(this.start.center.add(vec));
    }

    get vector() {
        return this._vector;
    }

    set length(val) {
        const vec = this._vector;
        vec.norm = val;
        this.vector = this._vector;
    }

    get length() {
        return this._vector.norm;
    }
}
