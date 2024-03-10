import Geometry from "../geometry/Geometry.js";
import Color from "../core/Color.js";
import * as Utils from "../utils/utils.js";
import Segment from "../geometry/Segment.js";
import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";
import * as VECTORS from "../constants/vectors.js";
import * as MathFunc from "../math/math_func.js";

export default class Graph2D extends Geometry {
    points = [];
    polygons = [];
    normal = VECTORS.OUT();

    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;

    lineJoin = "miter";

    move(point) {
        if (this.points.length !== 0) this.finish();
        this.points.push(point);
    }

    line(point) {
        this.points.push(point);
    }

    arc(radius, startAngle, endAngle, clockwise = true) {
        if (radius === 0) return;
        if (startAngle === endAngle) return;

        let center;
        if (this.points.length === 0) center = [0, 0, 0];
        else center = this.points[this.points.length - 1];
        this.polygons.push(
            generateArc(center, radius, startAngle, endAngle, clockwise, this)
        );
    }

    fill() {
        if (this.points.length !== 0) this.finish();

        const vertices = this.getAttributeVal("position");
        const colors = this.getAttributeVal("color");
        for (let polygon of this.polygons) {
            if (polygon.length < 3) continue;
            for (let point of polygon) {
                vertices.push(...point);
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
                const seg = new Segment(
                    Vector.fromArray(point),
                    Vector.fromArray(next)
                );
                seg.strokeWidth = this.strokeWidth;
                seg.strokeColor = this.strokeColor;
                seg.normal = this.normal;
                seg.update();
                this.addChild(seg);
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
            const l0 = target[i];
            const l1 = target[i + 1];
            const v0 = l0.vector;
            const v1 = l1.vector;

            if (v0.cross(v1).norm === 0) return;

            const tangent = v1.mult(-1).normal().add(v0.normal());
            const tmp = v0
                .trans(Matrix.rotateOn(this.normal, Math.PI / 2, 3))
                .normal();
            const cosine = tmp.dot(tangent);
            const halfWidth = l0.strokeWidth / 2;
            const join = tangent.mult(halfWidth / cosine);

            l0.getAttributeVal("position").splice(6, 3, ...l0.end.add(join));
            l1.getAttributeVal("position").splice(0, 3, ...l0.end.add(join));
            l0.getAttributeVal("position").splice(9, 3, ...l0.end.reduce(join));
            l1.getAttributeVal("position").splice(3, 3, ...l0.end.reduce(join));
        }
    }

    redraw() {}

    clear() {
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

    applyPointwiseTransform(trans, { runTime = 1 } = {}) {
        let from, to, polygons;

        this.layer.timeline.addFollow(runTime, {
            start: () => {
                from = Utils.deepCopy(this.polygons);
                for (let polygon of this.polygons) {
                    for (let i = 0; i < polygon.length; i++) {
                        polygon[i] = trans(polygon[i]);
                    }
                }
                to = Utils.deepCopy(this.polygons);
                polygons = this.polygons;
            },
            update: handler.bind(this),
        });

        function handler(p) {
            this.clearBuffer();
            for (let j = 0; j < polygons.length; j++) {
                const polygon = polygons[j];
                for (let i = 0; i < polygon.length; i++) {
                    polygon[i] = MathFunc.lerpArray(from[j][i], to[j][i], p);
                }
            }
            this.redraw();
        }
    }
}

function generateArc(center, radius, startAngle, endAngle, clockwise, target) {
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
        unit = (edAng - stAng - Math.PI * 2) / 25;
    } else {
        unit = (edAng - stAng) / 25;
    }

    for (let i = 0; i < 25; i++) {
        addPointAt(stAng + i * unit);
        addPointAt(stAng + i * unit + unit);
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
