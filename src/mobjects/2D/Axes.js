import Graph2D from "./Graph2D.js";
import Vector from "../../math/Vector.js";
import Axis from "./Axis.js";
import Point from "./Point.js";
import FunctionGraph2D from "./FunctionGraph2D.js";
import FunctinoGraph3D from "../3D/FunctionGraph3D.js";

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

        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = zRange;

        this.graphs = [];

        this.add(this.xAxis);
        this.add(this.yAxis);
        this.add(this.zAxis);

        for (let axis of this.children) {
            axis.update();
        }
    }

    addTip() {
        this.xAxis.addTip(1);
        this.yAxis.addTip(1);
        this.zAxis.addTip(1);

        for (let axis of this.children) {
            axis.update();
        }
    }

    drawFunction2D(func, { step = 0.1, autoStack = true } = {}) {
        const range = this.xRange;
        range[2] = step;
        const last = this.graphs[this.graphs.length - 1];
        const z = autoStack && last ? last.z + 0.001 : 0.01;

        const graph = new FunctionGraph2D({ func, xRange: range, z });
        graph.update();

        this.add(graph);
        this.graphs.push(graph);
        return graph;
    }

    drawFunction3D(func, { step = 0.5 } = {}) {
        const xRange = this.xRange;
        const yRange = this.yRange;

        xRange[2] = step;
        yRange[2] = step;

        const graph = new FunctinoGraph3D({ func, xRange, yRange });
        graph.update();

        this.add(graph);
        this.graphs.push(graph);
        return graph;
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
