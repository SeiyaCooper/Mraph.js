import Graph2D from "../Graph2D.js";
import Vector from "../../math/Vector.js";
import Axis from "../2d/Axis.js";
import Point from "../2d/Point.js";

export default class Axes extends Graph2D {
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
    }

    set layer(val) {
        this._layer = val;
        val.add(this.xAxis, this.yAxis, this.zAxis);
    }
    get layer() {
        return this._layer;
    }
}
