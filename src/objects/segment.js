import Mraph from "../app.js";
import Graph from "./graph.js";
import Point from "./point.js";

/**
 * 线段
 * @class
 */
class Segment extends Graph {
    /**
     * 构造一条新线段
     * @constructor
     * @param {Point} p1 线段的起始点
     * @param {Point} p2 线段的结束点
     * @return {Segment}
     */
    constructor(p1, p2, draw) {
        super(draw);
        this.size = 5;
        this.point1 = Point.getPoint(p1);
        this.point2 = Point.getPoint(p2);
    }
    /**
     * 绘制线端
     */
    draw() {
        if (!this.visible) return;
        const ctx = Mraph.ctx2d;

        ctx.beginPath();
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        ctx.stroke();

        return this;
    }
    /**
     * 线段长度
     */
    get length() {
        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    }
    /**
     * 线段斜率
     */
    get slope() {
        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);
    }
}

Mraph.Segment = Segment;
export default Segment;