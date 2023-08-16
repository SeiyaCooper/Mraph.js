import Graph from "./Graph.js";
import Point from "./Point.js";

export default class Segment extends Graph {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        const renderer = this.renderer;
        renderer.style(this);
        renderer.begin();
        renderer.move(this.start.pos);
        renderer.line3D(this.end.pos);
        renderer.stroke();

        return this;
    }

    set vector(vec) {
        this._vector = vec;
        this.end = new Point(this.start.pos.add(vec));
    }

    get vector() {
        return this._vector;
    }

    set length(val) {
        const vec = this._vector;
        vec.length = val;
        this.vector = this._vector;
    }

    get length() {
        return this._vector.length;
    }
}
