import Mobject3D from "../3D/Mobject3D.js";
import Mobject from "../Mobject.js";
import Color from "../../math/Color.js";
import * as Utils from "../../utils/utils.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";
import Mobject2DMaterial from "../../material/Mobject2DMaterial.js";
import * as VECTORS from "../../constants/vectors.js";

export default class Mobject2D extends Mobject {
    points = [];
    polygons = [];

    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;
    closePath = false;
    normal = VECTORS.OUT.clone();

    lineJoin = "miter";

    material = new Mobject2DMaterial();
    fillZone = new Mobject3D();

    constructor() {
        super();
        this.add(this.fillZone);
        this.material.colorMode = "vertex";
        this.fillZone.material.colorMode = "vertex";
    }

    /**
     * Moves your pen to another point.
     * This method is used to draw a path.
     * @param {Vector | number[]} point
     */
    move(point) {
        if (this.points.length !== 0) this.finish();
        this.points.push(point);
    }

    /**
     * Drags your pen to another place and draws a line.
     * This method is used to draw a path.
     * @param {Vector | number[]} point
     */
    line(point) {
        this.points.push(point);
    }

    /**
     * Draws an arc.
     * This method is used to draw a path.
     * @param {number} radius
     * @param {number} startAngle
     * @param {number} endAngle
     * @param {boolean} clockwise
     * @param {number} segments
     * @returns
     */
    arc(radius, startAngle, endAngle, clockwise = true, segments = 25) {
        if (radius === 0) return;
        if (startAngle === endAngle) return;

        let center;
        if (this.points.length === 0) center = [0, 0, 0];
        else center = this.points[this.points.length - 1];
        this.polygons.push(generateArc(center, radius, startAngle, endAngle, clockwise, segments, this));
    }

    /**
     * Fills the path you've drawn.
     */
    fill() {
        if (this.points.length !== 0) this.finish();

        const fillZone = this.fillZone;
        const vertices = fillZone.getAttributeVal("position") ?? [];
        const colors = fillZone.getAttributeVal("color") ?? [];

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

        fillZone.setColor(this.fillColor);
        fillZone.setAttribute("position", vertices, 3);
        fillZone.setAttribute("color", colors, 4);
        fillZone.setIndex(vertices.length / 3);
    }

    /**
     * Strokes the path you've drawn.
     */
    stroke() {
        if (this.points.length !== 0) this.finish();

        const reverse = this.getAttributeVal("reverse") ?? [];
        const vertices = this.getAttributeVal("position") ?? [];
        const previous = this.getAttributeVal("previous") ?? [];
        const colors = this.getAttributeVal("color") ?? [];

        for (let polygon of this.polygons) {
            for (let i = 1; i < polygon.length; i++) {
                const start = polygon[i];
                const end = polygon[i - 1];

                vertices.push(...start);
                vertices.push(...start);
                vertices.push(...end);
                vertices.push(...start);
                vertices.push(...end);
                vertices.push(...end);

                previous.push(...end);
                previous.push(...end);
                previous.push(...start);
                previous.push(...end);
                previous.push(...start);
                previous.push(...start);

                colors.push(...this.strokeColor);
                colors.push(...this.strokeColor);
                colors.push(...this.strokeColor);
                colors.push(...this.strokeColor);
                colors.push(...this.strokeColor);
                colors.push(...this.strokeColor);

                reverse.push(-1, 1, 1, 1, 1, -1);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("previous", previous, 3);
        this.setAttribute("reverse", reverse, 1);
        this.setAttribute("color", colors, 4);
        this.setUniform("thickness", this.strokeWidth);
        this.setIndex(this.getAttributeVal("position").length / 3);
    }

    draw() {}

    prepare4NonlinearTransform(segmentsNum = 30) {
        const polygons = this.polygons;
        for (let i = 0; i < polygons.length; i++) {
            const polygon = polygons[i];
            const replace = [];
            for (let j = 0; j < polygon.length - 1; j++) {
                const point = polygon[j];
                const nextPoint = polygon[j + 1];

                replace.push(point);
                for (let k = 1; k < segmentsNum; k++) {
                    replace.push(MathFunc.lerpArray(point, nextPoint, k / segmentsNum));
                }
                replace.push(nextPoint);
            }

            polygons[i] = replace;
        }
        this.clearBuffer();
        this.draw();
    }

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
        this.setAttribute("previous", [], 3);
        this.setAttribute("reverse", [], 1);
        this.setAttribute("color", [], 1);
    }

    finish() {
        this.polygons.push(Utils.deepCopy(this.points));
        this.points = [];
    }

    setColor(color) {
        this.strokeColor = color;
        this.fillColor = color;
    }

    pointwiseTransform(trans) {
        for (let polygon of this.polygons) {
            for (let i = 0; i < polygon.length; i++) {
                polygon[i] = trans(Vector.fromArray(polygon[i]));
            }
        }
        this.clearBuffer();
        this.draw();
    }

    animate = {
        ...this.animate,

        /**
         * Applies a non-linear transform
         * @param {Function} trans
         * @param {Object} config
         */
        pointwiseTransform: ((trans, { runTime = 1, ...configs } = {}) => {
            let fromPoints = [],
                toPoints = [];
            let fromPrevious = [],
                toPrevious = [];
            const config = {
                start: () => {
                    fromPoints = this.getPoints();
                    for (let point of fromPoints) {
                        toPoints.push(...trans(Vector.fromArray(point)));
                    }
                    fromPoints = fromPoints.flat(1);

                    fromPrevious = this.attr2Array("previous");
                    for (let point of fromPrevious) {
                        toPrevious.push(...trans(Vector.fromArray(point)));
                    }
                    fromPrevious = fromPrevious.flat(1);
                },
                update: (p) => {
                    this.setAttribute("position", MathFunc.lerpArray(fromPoints, toPoints, p), 3);
                    this.setAttribute("previous", MathFunc.lerpArray(fromPrevious, toPrevious, p), 3);
                },
                ...configs,
            };
            this.layer.timeline.addFollow(runTime, config);
        }).bind(this),
    };

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
