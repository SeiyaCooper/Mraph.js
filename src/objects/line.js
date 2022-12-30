import Mraph from "../app.js";
import Segment from "./segment.js";

class Line extends Segment {
    constructor(...args) {
        super(...args);
        this.color = "#C61C1CFF";
    }
    draw() {
        if (!this.visible) return;
        const ctx = Mraph.ctx2d;
        ctx.beginPath();
        ctx.lineWidth = this.size;
        ctx.strokeStyle = this.color;
        
        const w = Mraph.canvas.width; // Canvas 宽
        const h = Mraph.canvas.height; // Canvas 高
        const p1 = this.point1 // 起始点
        const p2 = this.point2 // 结束点
        // 分横坐标是否相等两种情况
        if (p2.x - p1.x !== 0) {
            const s = this.slope; // 斜率
            
            //计算在屏幕最左和最右的交点并连接
            ctx.moveTo(-w/2, p1.y + (-w/2 - p1.x) * s);
            ctx.lineTo(w/2, p2.y + (w/2 - p2.x) * s);
        } else {
            ctx.moveTo(p1.x, -h/2);
            ctx.lineTo(p1.x, h/2);
        }
        ctx.stroke();
        return this;
    }
}

Mraph.Line = Line;