import Graph from "./graph.js";

class Circle extends Graph {
    constructor(p1, p2, draw) {
        super(draw);
        this.size = 5;
        this.color = "#F05D11FF";
        this.fillColor = "#F05D1199";
        this.point1 = mraph.getPoint(p1);
        //判断是否使用固定半径初始化
        if (Object.prototype.toString.call(p2) == "[object Number]") {
            //使用数字
            const point = new mraph.Point(this.point1.x + p2, this.point1.y);
            point.visible = false;
            this.point2 = point;
        } else {
            this.point2 = mraph.getPoint(p2);
        }
    }
    draw() {
        if (!this.visible) return;
        const ctx = mraph.ctx2d;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.size;
        ctx.arc(this.point1.x, this.point1.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        return this;
    }
    get radius() {
        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    }
}

export default Circle;