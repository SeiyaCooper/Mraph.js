import Mraph from "../app.js";
import Point from "./point.js";
import animation from "../animation/animation.js";

class Group {
    /**
     * 构造新群组
     * @constructor
     * @param {Array} objs 群组中的对象
     * @return {Group}
     */
    constructor(objs) {
        this.objects = objs;
        this._basePosition = Point.getPos(objs[0]);
    }
    
    draw() {
        for (const obj of this.objects) obj.draw();
    }
    
    moveTo(pos, start, end) {
        let startX, startY, xDis, yDis; //开始坐标 移动距离
        const self = this;
        
        animation.add(start, end, {
            start: () => {
                pos = Point.getPos(pos);
                startX = self.basePosition[0];
                startY = self.basePosition[1];
                xDis = pos[0] - startX;
                yDis = pos[1] - startY;
                
                // 移动子元素
                for (const obj of self.objects) {
                    obj.moveTo([obj.x + xDis, obj.y + yDis], start, end);
                }
            },
            update: p => {
                p = animation.easeInOut(p, start, end);
                
                // 移动自身
                self._basePosition = [
                    startX + xDis * p,
                    startY + yDis * p
                ];
            }
        });
    }
    
    set basePosition(position) {
        this._basePosition = Point.getPos(position);
    }
    get basePosition() {
        return this._basePosition;
    }
}

Mraph.Group = Group;