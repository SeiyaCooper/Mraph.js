import { mergeObject } from "../utils/utils.js";
import Graph from "../core/graph.js";

export default class Point extends Graph {
    constructor(x, y, config) {
        super();
        this.x = x;
        this.y = y;
        this.size = 10;
        this.fillColor = "black";
        this.strokeColor = "rgba(0, 0, 0, 0)";
        mergeObject(this, config);
    }

    draw() {
        Graph.draw(this, (ctx) => {
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        });
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
