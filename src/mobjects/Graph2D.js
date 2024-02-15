import Geometry from "../geometry/Geometry.js";
import Color from "../core/Color.js";
import * as Utils from "../utils/utils.js";
import Segment from "../geometry/Segment.js";
import Vector from "../math/Vector.js";
import * as VECTORS from "../constants/vectors.js";

export default class Graph2D extends Geometry {
    points = [];
    polygons = [];
    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;
    normal = VECTORS.OUT();

    move(point) {
        if (this.points.length !== 0) this.finish();
        this.points.push(point);
    }

    line(point) {
        this.points.push(point);
    }

    arc(radius, startAngle, endAngle, clockwise = true) {
        if (radius === 0) return;

        let center;
        if (this.points.length === 0) center = [0, 0, 0];
        else center = this.points[this.points.length - 1];
        this.polygons.push(
            new ArcPath(center, radius, startAngle, endAngle, clockwise)
        );
    }

    fill() {
        if (this.points.length !== 0) this.finish();

        const vertices = this.getAttributeVal("position");
        const colors = this.getAttributeVal("color");
        for (let polygon of this.polygons) {
            if (!Array.isArray(polygon)) {
                polygon.fill(this, vertices, colors);
                continue;
            }
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
            if (!Array.isArray(polygon)) {
                polygon.stroke(this);
                continue;
            }
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
            }
        }

        this.combineChildren();
    }

    clear() {
        this.points = [];
        this.polygons = [];
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
}

class ArcPath {
    constructor(center, radius, startAngle, endAngle, clockwise = true) {
        this.center = center;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.clockwise = clockwise;
    }

    fill(target, vertices, colors) {
        const fillColor = target.fillColor;
        const center = Vector.fromArray(this.center);
        const xAxis = new Vector(0, 1, 0).cross(target.normal);
        const yAxis = target.normal.cross(xAxis);
        const r = this.radius;

        let stAng = this.startAngle;
        let edAng = this.endAngle;
        let clockwise = this.clockwise;
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
            vertices.push(...center);
            colors.push(...fillColor);
            addPointAt(stAng + i * unit);
            addPointAt(stAng + i * unit + unit);
        }

        function addPointAt(ang) {
            const x = xAxis.clone();
            const y = yAxis.clone();

            x.norm = Math.cos(ang) * r;
            y.norm = Math.sin(ang) * r;
            vertices.push(...center.add(x).add(y));

            colors.push(...fillColor);
        }
    }

    stroke() {}
}
