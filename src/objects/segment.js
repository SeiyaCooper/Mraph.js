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
     * @param {(Point | Array<Number>)} p1 线段的起始点
     * @param {(Point | Array<Number>)} p2 线段的结束点
     * @return {Segment}
     */
    constructor(p1, p2, config) {
        super(Object.assign({
            point1: Point.getPoint(p1),
            point2: Point.getPoint(p2),
            size: 5,
        }, config));
    }
    /**
     * 绘制线端
     */
    draw() {
        if (!this.visible && !this.layer) return;
        const ctx = this.layer.ctx;

        ctx.beginPath();
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.stroke.color;
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        ctx.stroke();

        return this;
    }
    /**
     * 获取线段长度
     */
    get length() {
        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    }
    /**
     * 获取线段斜率
     */
    get slope() {
        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);
    }
    /**
     * 线段与水平线的夹角 (弧度制)
     */
    get angle() {
        return Math.atan2(this.point2.y - this.point1.y, this.point2.x - this.point1.x);
    }
}

Mraph.Segment = Segment;
export default Segment;