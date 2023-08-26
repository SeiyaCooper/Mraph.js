import Graph from "./Graph.js";
import Segment from "./Segment.js";

export default class Path extends Graph {
    _close = false;

    constructor(...points) {
        super();
        this.points = points;
    }

    update() {
        const segments = [];
        const points = this.points;

        for (let i = 0; i < points.length - 1; i++) {
            segments.push(new Segment(points[i], points[i + 1]));
        }
        if (this.close) {
            segments.push(new Segment(points[points.length - 1], points[0]));
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
