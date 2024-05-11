import Graph2D from "./Graph2D.js";
import Vector from "../../math/Vector.js";
import Segment from "../../geometry/Segment.js";

const defaultModifyLine = (line, i, all) => {
    line.strokeColor.a *= i / all;
};

export default class Tail extends Graph2D {
    step = 0;

    constructor(
        target,
        { maxLength = 20, maxSteps = 3, modifyLine = defaultModifyLine } = {}
    ) {
        super();
        this.target = target;
        this.trail = [target.center];
        this.strokeWidth = 0.03;
        this.maxLength = maxLength;
        this.maxSteps = maxSteps;
        this.modifyLine = modifyLine;
    }

    update() {
        const trail = this.trail;
        this.step++;

        if (this.step >= this.maxSteps) {
            trail.push(this.target.center);
            this.step = 0;
        }
        if (trail.length >= this.maxLength) trail.shift();

        this.clearGraph();
        for (let step of trail) {
            this.line(step);
        }
        this.line(this.target.center);

        this.draw();
        return this;
    }

    draw() {
        this.stroke();
        return this;
    }

    stroke() {
        if (this.points.length !== 0) this.finish();

        for (let polygon of this.polygons) {
            const target = [];

            for (let i = 0; i < polygon.length - 1; i++) {
                const point = polygon[i];
                const next = polygon[i + 1];
                const seg = new Segment(
                    Vector.fromArray(point),
                    Vector.fromArray(next)
                );

                seg.strokeWidth = this.strokeWidth;
                seg.strokeColor = this.strokeColor.clone();
                seg.normal = this.normal;
                this.modifyLine(seg, i, polygon.length);
                seg.update();
                this.add(seg);
                target.push(seg);
            }

            switch (this.lineJoin) {
                case "miter":
                    this.modifyLineJoin2Miter(target);
                    break;
                default:
                    break;
            }

            this.combineChildren();
        }
    }
}
