import Graph from "../core/graph.js";
import Segment from "./segment.js";
import { copy } from "../utils/utils.js";

export default class NumberLine extends Graph {
    constructor(p1, p2, unit, config) {
        super();
        this.axis = new Segment(p1, p2);
        this.unit = unit;
        this.size = 20;
        copy(this, config);
    }
    
    draw() {
        const axis = this.axis;
        const sin = Math.sin(axis.angle);
        const cos = Math.cos(axis.angle);
        
        axis.draw();
        Graph.draw(this, ctx => {
            for (let num = 0; num < axis.length; num += this.unit) {
                const x = axis.point1.x + cos * num;
                const y = axis.point1.y + sin * num;
                
                ctx.moveTo(x, y);
                ctx.lineTo(x + sin * this.size, y - cos * this.size);
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