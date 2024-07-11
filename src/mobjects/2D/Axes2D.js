import Mobject2D from "./Mobject2D.js";
import Vector from "../../math/Vector.js";
import Matrix from "../../math/Matrix.js";
import Axis from "./Axis.js";
import Point from "./Point.js";
import FunctionGraph2D from "./FunctionGraph2D.js";
import * as COLORS from "../../constants/colors.js";

export default class Axes2D extends Mobject2D {
    _tickLength = 0.08;

    strokeWidth = 0.01;

    /**
     * Creates an axes2d mobject
     * @param {Object} configs
     */
    constructor({
        xRange = [-8, 8, 1],
        yRange = [-5, 5, 1],
        origin = new Point(0, 0),

        drawGrid = true,
    } = {}) {
        super();

        this.setColor(COLORS.BLUE_E);
        this.origin = origin;
        this.xRange = xRange;
        this.yRange = yRange;
        this.drawGrid = drawGrid;
        this.graphs = [];
        this.xAxis = Axis.fromRange(this.origin, new Vector(1, 0, 0), this.xRange);
        this.yAxis = Axis.fromRange(this.origin, new Vector(0, 1, 0), this.yRange);
        this.add(this.xAxis);
        this.add(this.yAxis);
    }

    update() {
        this.xAxis = Axis.fromRange(this.origin, new Vector(1, 0, 0), this.xRange);
        this.yAxis = Axis.fromRange(this.origin, new Vector(0, 1, 0), this.yRange);
        this.xAxis.update();
        this.yAxis.update();
        this.add(this.xAxis);
        this.add(this.yAxis);

        if (this.drawGrid) {
            const xLen = this.xRange[1] - this.xRange[0];
            const yLen = this.yRange[1] - this.yRange[0];

            let tick = new Vector(1, 0, 0)
                .trans(Matrix.rotateOn(this.normal, Math.PI / 2, 3))
                .normal()
                .mult(yLen / 2);

            for (let pos = -xLen / 2; pos <= xLen / 2; pos += this.xRange[2]) {
                if (pos === 0) continue;
                const at = new Vector(pos, 0, 0);
                this.move(at.minus(tick));
                this.line(at.add(tick));
            }

            tick = new Vector(0, 1, 0)
                .trans(Matrix.rotateOn(this.normal, Math.PI / 2, 3))
                .normal()
                .mult(xLen / 2);

            for (let pos = -yLen / 2; pos <= yLen / 2; pos += this.yRange[2]) {
                if (pos === 0) continue;
                const at = new Vector(0, pos, 0);
                this.move(at.minus(tick));
                this.line(at.add(tick));
            }

            this.stroke();
        }

        this.draw();
    }

    draw() {
        this.stroke();
        this.xAxis.draw();
        this.yAxis.draw();
    }

    /**
     * Adda tip to x and y axes
     * @param {number} [at=1]
     */
    addTip(at = 1) {
        this.xAxis.addTip(at);
        this.yAxis.addTip(at);
    }

    /**
     * Plots a function on this plane
     * @param {*} func
     * @param {*} configs
     * @returns {FunctionGraph2D}
     */
    drawFunction(func, { step = 0.1, autoStack = true } = {}) {
        const range = [...this.xRange];
        range[2] = step;
        const last = this.graphs[this.graphs.length - 1];
        const z = autoStack && last ? last.z + 0.001 : 0.01;

        const graph = new FunctionGraph2D({ func, xRange: range, z });
        graph.update();

        this.add(graph);
        this.graphs.push(graph);
        return graph;
    }

    set tickLength(val) {
        this.xAxis.tickLength = val;
        this.yAxis.tickLength = val;
        this._tickLength = val;
    }

    get tickLength() {
        return this._tickLength;
    }
}
