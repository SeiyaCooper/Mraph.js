import copy from "../utils/utils.js";
import Graph from "../core/graph.js";
import Point from "./point.js";

export class Segment extends Graph {
    constructor(p1, p2, config) {
        super();
        this.point1 = Point.getPoint(p1);
        this.point2 = Point.getPoint(p2);
        copy(this, config);
    }

    draw() {
        if (!this.layer) return;
        super.setContextAttr();

        const ctx = this.layer.context;

        ctx.beginPath();
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);

        ctx.stroke();
    }

    /**
     * get length
     */
    get length() {
        return Math.hypot(
            this.point2.x - this.point1.x,
            this.point2.y - this.point1.y
        );
    }
    /**
     * get slope
     */
    get slope() {
        return (
            (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x)
        );
    }
    /**
     * get the angle with horizontal line
     */
    get angle() {
        return Math.atan2(
            this.point2.y - this.point1.y,
            this.point2.x - this.point1.x
        );
    }
}
