// 一些工具类和方法
import Mraph from "../app.js";
import Point from "../objects/point.js"

const tool = {
    // 从数组获取点
    getPoint(array) {
        if (array instanceof Point) {
            return array;
        } else {
            return new Point(...array, false);
        }
    },
    //从点获取数组
    getPos(point) {
        if (point instanceof Point) {
            return [point.x, point.y];
        } else {
            return point;
        }
    }
};

export default tool;