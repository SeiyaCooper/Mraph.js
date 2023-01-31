import { copy } from "../utils/utils.js";
import Graph from "../core/graph.js";
import Point from "./point.js";
import Segment from "./segment.js";

export default class Arc extends Graph {
    constructor(p1, p2, p3, config) {
        super();
        this.point1 = Point.getPoint(p1);
        this.point2 = Point.getPoint(p2);
        this.point3 = Point.getPoint(p3);
        this.side1 = new Segment(this.point1, this.point2);
        this.side2 = new Segment(this.point1, this.point3);
        copy(this, config);
    }

    draw() {
        Graph.draw(this, (ctx) => {
            ctx.moveTo(this.point1.x, this.point1.y);
            ctx.arc(this.point1.x, this.point1.y, this.radius, this.side1.angle, this.side2.angle);
        });
    }

    set radius(value) {
        this._radius = value;
    }
    get radius() {
        if (typeof this._radius === "number") {
            return this._radius;
        } else {
            return this.side1.length;
        }
    }
}
