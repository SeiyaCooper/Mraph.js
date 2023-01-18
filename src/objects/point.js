import Mraph from "../app.js";
import Graph from "./graph.js";
import animation from "../animation/animation.js";

/**
 * 点
 * @class
 */
class Point extends Graph {
    /**
     * 构造一个新点
     * @constructor
     * @param {Number} x 点的横坐标
     * @param {Point} y 点的纵坐标
     * @return {Point}
     */
    constructor(x, y, config) {
        super(Object.assign({
            x: x,
            y: y,
            size: 10,
            fillColor: "black"
        }, config));
    }
    /**
     * 绘制点
     */
    draw() {
        if (!this.visible && !this.layer) return;
        const ctx = this.layer.ctx;
        
        ctx.beginPath();
        ctx.lineWidth = 2 * this.size;
        ctx.fillStyle = this.fillColor;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        
        return this;
    }
    
    /**
     * 移动点到指定位置
     * @param {(Point | Array<Number>)} pos 指定移动目标位置
     * @param {Number} start 开始的时间 (秒)
     * @param {Number} end 结束的时间 (秒)
     */
    moveTo(pos, start, end) {
        let startX, startY; // 初始坐标
        let xDis, yDis; // 距离
        let cp; // 经过计算的进度
        const self = this;
        
        animation.add(start, end, {
            start: () => {
                pos = Point.getPos(pos); // 目标位置
                startX = self.x;
                startY = self.y;
                xDis = pos[0] - startX;
                yDis = pos[1] - startY;
            },
            update: p => {
                p = animation.easeInOut(p, 0, 1);
                
                self.x = startX + xDis * p;
                self.y = startY + yDis * p;
            }
        });
    }
    /**
     * 指定绕点旋转
     * @param {(Point | Array<Number>)} pos 指定旋转中心
     * @param {Number} angle 旋转角度 (弧度制)
     * @param {Number} start 开始的时间 (秒)
     * @param {Number} end 结束的时间 (秒)
     */
    rotateAround(point, angle, start, end) {
        let radius, radiusLen, startAngle; // 旋转半径 起始角
        const self = this;
        
        animation.add(start, end, {
            start: () => {
                point = Point.getPoint(point);
                radius = new Mraph.Segment(point, self, false);
                radiusLen = radius.length;
                startAngle = radius.angle;
            },
            update: p => {
                p = animation.easeInOut(p, 0, 1);
                
                self.x = Math.cos(angle * p + startAngle) * radiusLen + point.x;
                self.y = Math.sin(angle * p + startAngle) * radiusLen + point.y;
            }
        });
    }
    /**
     * 从数组获取点
     */
    static getPoint(array) {
        if (array instanceof Point) {
            return array;
        } else {
            return new Point(...array, false);
        }
    }
    /**
     * 从点获取数组
     */
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