import Graph2D from "./Graph2D.js";
import Vector from "../math/Vector.js";
import Axis from "./Axis.js";
import Point from "./Point.js";

export default class Axes extends Graph2D {
    _tickLength = 0.08;

    constructor({
        xRange = [-8, 8, 1],
        yRange = [-4, 4, 1],
        zRange = [-4, 4, 1],
        center = new Point(0, 0),
    } = {}) {
        super();

        this.center = center;
        this.xAxis = Axis.fromRange(center, new Vector(1, 0, 0), xRange);
        this.yAxis = Axis.fromRange(center, new Vector(0, 1, 0), yRange);
        this.zAxis = Axis.fromRange(center, new Vector(0, 0, 1), zRange);
        this.zAxis.normal = new Vector(1, 0, 0);

        this.addChild(this.xAxis);
        this.addChild(this.yAxis);
        this.addChild(this.zAxis);
    }

    addTip() {
        this.xAxis.addTip(1);
        this.yAxis.addTip(1);
        this.zAxis.addTip(1);
    }

    set tickLength(val) {
        for (let child of this.children) {
            child.tickLength = val;
            child.update();
        }
        this._tickLength = val;
    }

    get tickLength() {
        return this._tickLength;
    }
}
