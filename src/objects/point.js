import Mraph from "../app.js";
import Graph from "./graph.js";

/**
 * 点
 * @class
 */
class Point extends Graph {
    constructor(x, y, draw) {
        super(draw);
        this.size = 10;
        this.x = x;
        this.y = y;
    }
    draw() {
        if(!this.visible) return;
        const ctx = Mraph.ctx2d;
        
        ctx.beginPath();
        ctx.lineWidth = 2 * this.size;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        
        return this;
    }
    moveTo(pos, start, end) {
        let startX, startY; // 初始坐标
        let xDis, yDis; // 距离
        const self = this;
        
        Mraph.animation.add(start, end, {
            start: () => {
                pos = Point.getPos(pos); // 目标位置
                startX = self.x;
                startY = self.y;
                xDis = pos[0] - startX;
                yDis = pos[1] - startY;
            },
            update: p => {
                self.x = startX + xDis * p;
                self.y = startY + yDis * p;
            }
        });
    }
    // 从数组获取点
    static getPoint(array) {
        if (array instanceof Point) {
            return array;
        } else {
            return new Point(...array, false);
        }
    }
    // 从点获取数组
    static getPos(point) {
        if (point instanceof Point) {
            return [point.x, point.y];
        } else {
            return point;
        }
    }
}

Mraph.Point = Point;
export default Point;