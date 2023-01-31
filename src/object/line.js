import { copy } from "../utils/utils.js";
import Graph from "../core/graph.js";
import Segment from "./segment.js";

export default class Line extends Segment {
    constructor(start, end, config) {
        super(start, end);
        copy(this, config);
    }

    draw() {
        Graph.draw(this, (ctx) => {
            const w = this.layer.width;
            const h = this.layer.height;
            const p1 = this.point1;
            const p2 = this.point2;

            if (p2.x - p1.x !== 0) {
                const s = this.slope;
                ctx.moveTo(-w / 2, p1.y + (-w / 2 - p1.x) * s);
                ctx.lineTo(w / 2, p2.y + (w / 2 - p2.x) * s);
            } else {
                ctx.moveTo(p1.x, -h / 2);
                ctx.lineTo(p1.x, h / 2);
            }
        });
    }
}