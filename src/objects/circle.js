import Mraph from "../app.js";
import Graph from "./graph.js";
import Point from "./point.js";

/**
 * 圆
 * @class
 */

class Circle extends Graph {
    constructor(p1, p2, config) {
        super(Object.assign({
            point1: Point.getPoint(p1),
            point2: getPoint2(),
            size: 5,
            strokeColor: "#F05D11FF"
        }, config));
        
        function getPoint2 () {
            // 判断是否使用固定半径构造
            if (Object.prototype.toString.call(p2) == "[object Number]") {
                // 使用数字
                return new Mraph.Point(p1.x + p2, p1.y);
            } else {
                return Point.getPoint(p2);
            }
        }
    }
    draw() {
        if (!this.visible && !this.layer) return;
        const ctx = this.layer.ctx;
        
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.size;
        ctx.setLineDash(this.strokeDash);
        
        ctx.arc(this.point1.x, this.point1.y, this.radius, 0, 2 * Math.PI);
        
        ctx.stroke();
        ctx.fill();
        
        return this;
    }
    get radius() {
        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    }
}

Mraph.Circle = Circle;
export default Circle;