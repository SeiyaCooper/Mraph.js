import { copy } from "../utils/utils.js";
import { UNIT_LEN } from "../constant/constant.js";
import Graph from "../core/graph.js";

export default class Point extends Graph {
    constructor(x, y, config) {
        super();
        this.x = x;
        this.y = y;
        copy(this, config);
    }

    set x(value) {
        this._x = value * UNIT_LEN;
    }
    get x() {
        return this._x;
    }
    set y(value) {
        this._y = value * UNIT_LEN;
    }
    get y() {
        return this._y;
    }

    /**
     * get point from a array
     * @param {(Point | Array<Number>)} source
     * @return {Point}
     */
    static getPoint(source) {
        if (source instanceof Point) {
            return source;
        } else {
            return new Point(...source);
        }
    }
    /**
     * get position(array) from a point
     * @param {(Point | Array<Number>)} source
     * @return {Array<Number>}
     */
    static getPos(source) {
        if (source instanceof Point) {
            return [source.x, source.y];
        } else {
            return source;
        }
    }
}
