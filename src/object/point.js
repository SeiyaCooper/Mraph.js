import Graph from "../core/graph.js";

export class Point extends Graph {
    constructor() {
        super();
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
