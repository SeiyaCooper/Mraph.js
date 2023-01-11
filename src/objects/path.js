import Mraph from "../app.js";
import Graph from "./graph.js";
import Point from "./point.js";

/**
 * 路径
 * @class
 */

class Path extends Graph {
    constructor(points, config) {
        super(Object.assign({
            points: (points.map(el => {
                return Point.getPoint(el);
            })) ?? [],
            closed: true,
            size: 5
        }, config));
    }
    draw() {
        if (!this.visible && !this.layer) return;
        
        const ctx = this.layer.ctx;
        const points = this.points;
        
        // 设置样式
        ctx.beginPath();
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.stroke.color;
        ctx.fillStyle = this.fill.color;
        
        // 绘制
        ctx.moveTo(points[0].x, points[0].y);
        for (const point of points) {
            ctx.lineTo(point.x, point.y);
        }
        
        if (this.closed) {
            ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();
        
        return this;
    }
}

Mraph.Path = Path;
export default Path;