import Mobject from "../Mobject.js";
import Color from "../../math/Color.js";
import * as Utils from "../../utils/utils.js";
import Segment from "../../geometry/Segment.js";
import Vector from "../../math/Vector.js";
import Complex from "../../math/Complex.js";
import Matrix from "../../math/Matrix.js";
import * as VECTORS from "../../constants/vectors.js";
import * as MathFunc from "../../math/math_func.js";

export default class Mobject2D extends Mobject {
    points = [];
    polygons = [];
    normal = VECTORS.OUT.clone();

    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;
    closePath = false;

    lineJoin = "miter";

    move(point) {
        if (this.points.length !== 0) this.finish();
        this.points.push(point);
    }

    line(point) {
        this.points.push(point);
    }

    arc(radius, startAngle, endAngle, clockwise = true, segments = 25) {
        if (radius === 0) return;
        if (startAngle === endAngle) return;

        let center;
        if (this.points.length === 0) center = [0, 0, 0];
        else center = this.points[this.points.length - 1];
        this.polygons.push(generateArc(center, radius, startAngle, endAngle, clockwise, segments, this));
    }

    fill() {
        if (this.points.length !== 0) this.finish();

        const vertices = this.getAttributeVal("position");
        const colors = this.getAttributeVal("color");
        for (let polygon of this.polygons) {
            if (polygon.length < 3) continue;

            const first = polygon[0];
            for (let i = 1; i < polygon.length - 1; i++) {
                vertices.push(...first);
                vertices.push(...polygon[i]);
                vertices.push(...polygon[i + 1]);
                colors.push(...this.fillColor);
                colors.push(...this.fillColor);
                colors.push(...this.fillColor);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setIndex(vertices.length / 3);
    }

    stroke() {
        if (this.points.length !== 0) this.finish();

        for (let polygon of this.polygons) {
            const target = [];

            for (let i = 0; i < polygon.length - 1; i++) {
                const point = polygon[i];
                const next = polygon[i + 1];
                const seg = new Segment(Vector.fromArray(point), Vector.fromArray(next));
                seg.strokeWidth = this.strokeWidth;
                seg.strokeColor = this.strokeColor;
                seg.normal = this.normal;
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

    modifyLineJoin2Miter(target) {
        for (let i = 0; i < target.length - 1; i++) {
            modifySingle(this, target, i, i + 1);
        }

        if (this.closePath) modifySingle(this, target, target.length - 1, 0);

        function modifySingle(self, target, now, next) {
            const l0 = target[now];
            const l1 = target[next];
            const v0 = l0.vector;
            const v1 = l1.vector;

            if (v0.cross(v1).norm === 0) return;

            const tangent = v1.mult(-1).normal().add(v0.normal()).normal();
            const tmp = v0.trans(Matrix.rotateOn(self.normal, Math.PI / 2, 3)).normal();
            const cosine = tmp.dot(tangent);
            const halfWidth = l0.strokeWidth / 2;
            const join = tangent.mult(halfWidth / cosine);

            l0.getAttributeVal("position").splice(6, 3, ...l0.end.add(join));
            l1.getAttributeVal("position").splice(0, 3, ...l0.end.add(join));
            l0.getAttributeVal("position").splice(9, 3, ...l0.end.minus(join));
            l1.getAttributeVal("position").splice(3, 3, ...l0.end.minus(join));
        }
    }

    draw() {}

    clearGraph() {
        this.clearPath();
        this.clearBuffer();
    }

    clearPath() {
        this.points = [];
        this.polygons = [];
    }

    clearBuffer() {
        this.setAttribute("position", [], 3);
        this.setAttribute("color", [], 4);
    }

    finish() {
        this.polygons.push(Utils.deepCopy(this.points));
        this.points = [];
    }

    setColor(color) {
        this.strokeColor = color;
        this.fillColor = color;
    }

    animate = {
        ...this.animate,

        /**
         * Applies a non-linear transform
         * @param {Function} trans
         * @param {Object} config
         */
        pointwiseTransform: ((trans, { runTime = 1, curve } = {}) => {
            let from, to, polygons;

            this.layer.timeline.addFollow(runTime, {
                start: () => {
                    from = Utils.deepCopy(this.polygons);
                    for (let polygon of this.polygons) {
                        for (let i = 0; i < polygon.length; i++) {
                            polygon[i] = trans(Vector.fromArray(polygon[i]));
                        }
                    }
                    to = Utils.deepCopy(this.polygons);
                    polygons = this.polygons;
                },
                update: handler.bind(this),
                curve,
            });

            function handler(p) {
                this.clearBuffer();
                for (let j = 0; j < polygons.length; j++) {
                    const polygon = polygons[j];
                    for (let i = 0; i < polygon.length; i++) {
                        const lerpFrom = from[j][i];
                        const lerpTo = to[j][i];
                        polygon[i] = MathFunc.lerpArray(lerpFrom, lerpTo, p);
                    }
                }
                this.draw();
            }
        }).bind(this),

        /**
         * Applies a complex function
         * @param {Function} trans
         * @param {Object} config
         */
        complexFuncTransform: ((trans, { runTime = 1, curve } = {}) => {
            const handler = (pos) => {
                return [...trans(Complex.fromArray(pos)), 0];
            };
            this.animate.pointwiseTransform(handler, { runTime, curve });
        }).bind(this),
    };

    pointwiseTransform(trans) {
        for (let polygon of this.polygons) {
            for (let i = 0; i < polygon.length; i++) {
                polygon[i] = trans(Vector.fromArray(polygon[i]));
            }
        }
        this.clearBuffer();
        this.draw();
    }

    static isInstance(obj) {
        return obj instanceof Mobject2D;
    }
}

function generateArc(center, radius, startAngle, endAngle, clockwise, segments, target) {
    const xAxis = new Vector(0, 1, 0).cross(target.normal);
    const yAxis = target.normal.cross(xAxis);
    const r = radius;
    const points = [];
    center = Vector.fromArray(center);

    let stAng = startAngle;
    let edAng = endAngle;
    if (stAng > edAng) {
        stAng = edAng;
        edAng = this.startAngle;
        clockwise = !clockwise;
    }

    let unit;
    if (clockwise) {
        unit = (edAng - stAng - Math.PI * 2) / segments;
    } else {
        unit = (edAng - stAng) / segments;
    }

    for (let i = 0; i < segments + 1; i++) {
        addPointAt(stAng + i * unit);
    }

    function addPointAt(ang) {
        const x = xAxis.clone();
        const y = yAxis.clone();

        x.norm = Math.cos(ang) * r;
        y.norm = Math.sin(ang) * r;
        points.push(center.add(x).add(y));
    }

    return points;
}
