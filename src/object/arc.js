import { copy } from "../utils/utils.js";
import { UNIT_LEN } from "../constant/constant.js";
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
        super.draw((ctx) => {
            ctx.arc(this.point1._x, this.point1._y, this._radius, this.side1.angle, this.side2.angle);
        });
    }

    set radius(value) {
        this._radius = value * UNIT_LEN;
    }
    get radius() {
        if (typeof this._radius === "number") {
            return this._radius / UNIT_LEN;
        } else {
            return this.side1.length;
        }
    }
}
