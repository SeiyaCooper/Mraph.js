import Mobject2D from "./Mobject2D.js";
import Vector from "../../math/Vector.js";
import Matrix from "../../math/Matrix.js";
import Axis from "./Axis.js";
import Point from "./Point.js";
import FunctionGraph2D from "./FunctionGraph2D.js";
import * as Utils from "../../utils/utils.js";
import * as MathFunc from "../../math/math_func.js";
import * as COLORS from "../../constants/colors.js";

export default class Axes2D extends Mobject2D {
    _tickLength = 0.08;

    strokeWidth = 0.01;

    constructor({
        xRange = [-8, 8, 1],
        yRange = [-5, 5, 1],
        origin = new Point(0, 0),

        drawGrid = true,
    } = {}) {
        super();

        this.setColor(COLORS.BLUE_E);
        this.origin = origin;
        this.xAxis = Axis.fromRange(origin, new Vector(1, 0, 0), xRange);
        this.yAxis = Axis.fromRange(origin, new Vector(0, 1, 0), yRange);

        this.xRange = xRange;
        this.yRange = yRange;

        this.graphs = [];

        this.add(this.xAxis);
        this.add(this.yAxis);

        for (let axis of this.children) {
            axis.update();
        }

        if (drawGrid) {
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
    }

    addTip() {
        this.xAxis.addTip(1);
        this.yAxis.addTip(1);

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

    animate = {
        ...this.animate,

        /**
         * Applies a non-linear transform.
         * For axes, it applies this transform to every axis and graph on it.
         * @param {Vector | number[]} pos
         * @param {Object} config
         */
        pointwiseTransform: ((trans, { runTime = 1, curve } = {}) => {
            let children = new Map();
            this.layer.timeline.addFollow(runTime, {
                start: () => {
                    for (let child of this.children) {
                        let from, to, polygons;
                        from = Utils.deepCopy(child.polygons);
                        for (let polygon of child.polygons) {
                            for (let i = 0; i < polygon.length; i++) {
                                polygon[i] = trans(Vector.fromArray(polygon[i]));
                            }
                        }
                        to = Utils.deepCopy(child.polygons);
                        polygons = child.polygons;
                        children.set(child, { from, to, polygons });
                    }
                },
                update: (p) => {
                    for (let child of this.children) {
                        handler(child, p);
                    }
                },
                curve,
            });

            function handler(target, p) {
                target.clearBuffer();
                const { polygons, from, to } = children.get(target);

                for (let j = 0; j < polygons.length; j++) {
                    const polygon = polygons[j];
                    for (let i = 0; i < polygon.length; i++) {
                        const lerpFrom = from[j][i];
                        const lerpTo = to[j][i];
                        polygon[i] = MathFunc.lerpArray(lerpFrom, lerpTo, p);
                    }
                }
                target.draw();
            }
        }).bind(this),
    };

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
