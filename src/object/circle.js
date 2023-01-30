import { copy } from "../utils/utils.js";
import { UNIT_LEN } from "../constant/constant.js";
import Graph from "../core/graph.js";
import Point from "./point.js";
import Segment from "./segment.js";

export default class Circle extends Graph {
    constructor(p1, p2, config) {
        super();
        this.strokeColor = "#f54519";
        this.point1 = Point.getPoint(p1);

        if (typeof p2 === "number") {
            this.radius = p2;
        } else {
            this.point2 = Point.getPoint(p2);
            this.radius = new Segment(p1, p2);
        }

        copy(this, config);
    }

    draw() {
        super.draw((ctx) => {
            ctx.arc(this.point1._x, this.point1._y, this.radius * UNIT_LEN, 0, 2 * Math.PI);
        });
    }

    set radius(value) {
        this._radius = value;
    }
    get radius() {
        if (typeof this._radius === "number") {
            return this._radius;
        } else {
            return this._radius.length;
        }
    }
}
