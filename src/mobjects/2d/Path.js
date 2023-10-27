import Graph2D from "../Graph2D.js";
import Line from "./Line.js";

export default class Path extends Graph2D {
    _close = false;

    constructor(...points) {
        super();
        this.points = points;
    }

    update() {
        const segments = [];
        const points = this.points;

        for (let i = 0; i < points.length - 1; i++) {
            segments.push(new Line(points[i], points[i + 1]));
        }
        if (this.close) {
            segments.push(new Line(points[points.length - 1], points[0]));
        }

        this.children = segments;
    }

    set close(val) {
        this._close = val;
        this.update();
    }

    get close() {
        return this._close;
    }
}
