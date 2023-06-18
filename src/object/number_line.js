import Graph from "../core/graph.js";
import Segment from "./segment.js";
import { mergeObject } from "../utils/utils.js";

export default class NumberLine extends Graph {
    showIntPoints = true;
    intPointsLen = 10;

    constructor(p1, p2, unit, config) {
        super();
        this.axis = new Segment(p1, p2);
        this.unit = unit;
        mergeObject(this, config);
    }

    draw() {
        const axis = this.axis;
        axis.draw();

        if (!this.showIntPoints) return;
        const sin = Math.sin(axis.angle);
        const cos = Math.cos(axis.angle);

        Graph.draw(this, (ctx) => {
            for (let num = 0; num < axis.length; num += this.unit) {
                const x = axis.point1.x + cos * num;
                const y = axis.point1.y + sin * num;

                ctx.moveTo(x, y);
                ctx.lineTo(x + sin * this.intPointsLen, y - cos * this.intPointsLen);
            }
        });
    }

    set layer(value) {
        this._layer = value;
        this.axis.layer = value;
    }
    get layer() {
        return this._layer;
    }
}
