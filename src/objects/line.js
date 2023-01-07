import Mraph from "../app.js";
import Segment from "./segment.js";

/**
 * 直线
 * @class
 */

class Line extends Segment {
    /**
     * 构造一条新直线
     * @constructor
     * @param {(Point | Array<Number>)} p1 直线的起始点
     * @param {(Point | Array<Number>)} p2 直线的结束点
     * @return {Segment}
     */
    constructor(...args) {
        super(...args);
        this.color = "#C61C1CFF";
    }
    /**
     * 绘制直线
     */
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