import Mobject from "../Mobject.js";
import Color from "../../math/Color.js";
import * as Utils from "../../utils/utils.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";
import Mobject2DMaterial from "../../material/Mobject2DMaterial.js";
import * as VECTORS from "../../constants/vectors.js";

export default class Mobject2D extends Mobject {
    /**
     * Array to store the points of the current polygon being drawn.
     * @type {number[][]}
     */
    points = [];

    /**
     * Array to store all the completed polygons.
     * @type {number[][][]}
     */
    polygons = [];

    /**
     * Array to store colors of each polygon.
     * @typedef {{fillColor: Color, strokeColor: Color}} ColorPair
     * @type {ColorPair[]}
     */
    colors = [];

    /**
     * The color used for filling the polygons.
     * @type {Color}
     */
    fillColor = new Color(1, 1, 1, 0);

    /**
     * The color used for strokes of the polygons.
     * @type {Color}
     */
    strokeColor = new Color(1, 1, 1, 1);

    /**
     * The width of strokes you've drawn.
     * @type {number}
     */
    strokeWidth = 0.05;

    /**
     * You can easily set the rendering order of Mobjects by using the zIndex, with objects having a lower zIndex being rendered first.
     * @type {number}
     */
    _zIndex = 0;

    /**
     * Normal vector, used to generate an arc.
     */
    normal = VECTORS.OUT.clone();

    /**
     * The strokes of the polygons.
     * Strokes are rendered as a child Mobject of this Mobject,
     * using a different material ('Mobject2DMaterial') for visual effects.
     */
    strokes = new Mobject();

    /**
     * 2D Mobjects.
     * (e.g. lines, polygons, arrows, etc.)
     * @returns {Mobject2D}
     */
    constructor() {
        super();
        this.add(this.strokes);

        this.material.colorMode = "vertex";

        this.strokes.material = new Mobject2DMaterial();
        this.strokes.material.colorMode = "vertex";
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
     * Fills a polygon you've drawn.
     * @param {Object} [configs={}]
     * @param {number[][]} [config.polygon] - polygon you want to fill with, will be the last one when left null.
     * @param {boolean} [configs.updateColor=true] - whether updates the fill color of 'polygon'.
     */
    fill({ polygon, updateColor = true } = {}) {
        const vertices = this.getAttributeVal("position") ?? [];
        const colors = this.getAttributeVal("color") ?? [];

        if (!polygon && this.points.length !== 0) this.finish();
        polygon = polygon ?? this.polygons[this.polygons.length - 1];

        const fillColor = updateColor ? this.fillColor : this.colors[this.polygons.indexOf(polygon)].fillColor;

        if (polygon.length < 3) return;
        if (!fillColor) return;

        const first = polygon[0];
        for (let i = 1; i < polygon.length - 1; i++) {
            vertices.push(...first);
            vertices.push(...polygon[i]);
            vertices.push(...polygon[i + 1]);
            colors.push(...fillColor);
            colors.push(...fillColor);
            colors.push(...fillColor);
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setIndex(vertices.length / 3);

        if (updateColor) this.setPolygonColor(polygon, { fillColor: this.fillColor });
    }

    /**
     * Strokes a polygon you've drawn.
     * @param {Object} [configs={}]
     * @param {number[][]} [polygon] - polygon you want to fill with, will be the last one when left null.
     * @param {boolean} [configs.updateColor=true] - whether updates stroke color of 'polygon'.
     */
    stroke({ polygon, updateColor = true } = {}) {
        const strokes = this.strokes;
        const reverse = strokes.getAttributeVal("reverse") ?? [];
        const vertices = strokes.getAttributeVal("position") ?? [];
        const previous = strokes.getAttributeVal("previous") ?? [];
        const colors = strokes.getAttributeVal("color") ?? [];

        if (!polygon && this.points.length !== 0) this.finish();
        polygon = polygon ?? this.polygons[this.polygons.length - 1];

        const strokeColor = updateColor ? this.strokeColor : this.colors[this.polygons.indexOf(polygon)].strokeColor;

        if (!strokeColor) return;

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

            colors.push(...strokeColor);
            colors.push(...strokeColor);
            colors.push(...strokeColor);
            colors.push(...strokeColor);
            colors.push(...strokeColor);
            colors.push(...strokeColor);

            reverse.push(-1, 1, 1, 1, 1, -1);
        }

        strokes.setAttribute("position", vertices, 3);
        strokes.setAttribute("previous", previous, 3);
        strokes.setAttribute("reverse", reverse, 1);
        strokes.setAttribute("color", colors, 4);
        strokes.setUniform("thickness", this.strokeWidth);
        strokes.setIndex(strokes.getAttributeVal("position").length / 3);

        if (updateColor) this.setPolygonColor(polygon, { strokeColor: this.strokeColor });
    }

    /**
     * Sets the colors for a specified polygon.
     * @param {number[][]} polygon - the polygon you want to set.
     * @param {Object} [colorPair={}] - an object containing the fill and stroke colors.
     * @param {Color} [colorPair.fillColor] - the fill color for the polygon.
     * @param {Color} [colorPair.strokeColor] - the stroke color for the polygon.
     */
    setPolygonColor(polygon, colorPair = {}) {
        const index = this.polygons.indexOf(polygon);
        const newColors = this.colors[index] ?? {};

        newColors.fillColor = colorPair.fillColor ?? newColors.fillColor;
        newColors.strokeColor = colorPair.strokeColor ?? newColors.strokeColor;
        this.colors[index] = newColors;
    }

    /**
     * Redraws all the polygons according to their associated colors.
     * This method is very useful when performing deformations.
     */
    redraw() {
        this.clearBuffers();
        this.polygons.forEach((polygon) => {
            this.stroke({ polygon, updateColor: false });
            this.fill({ polygon, updateColor: false });
        });
    }

    /**
     * Inserts points into polygons to reach the target number of vertices.
     * Used for non-linear transformation.
     * @param {number} targetPointsNum
     */
    insertPoints(targetPointsNum = 75) {
        const polygons = this.polygons;

        for (let i = 0; i < polygons.length; i++) {
            MathFunc.insertPointsAlongPath(polygons[i], targetPointsNum);
        }

        this.clearBuffers();
        this.redraw();
    }

    clearGraph() {
        this.clearPaths();
        this.clearBuffers();
    }

    clearPaths() {
        this.points = [];
        this.polygons = [];
        this.colors = [];
    }

    clearBuffers() {
        this.removeAllAttributes();
        this.strokes.removeAllAttributes();
    }

    finish() {
        if (this.points.length === 0) return;

        this.polygons.push(Utils.deepCopy(this.points));
        this.points = [];
    }

    setColor(color, { fillOpacity = 0.3 } = {}) {
        this.strokeColor = color;
        this.fillColor = color.withRGBA({ a: fillOpacity });
    }

    toMorphable() {
        return Utils.deepCopy(this.polygons);
    }

    fromMorphable(morphable) {
        this.polygons = morphable;
        this.redraw();
    }

    static isInstance(obj) {
        return obj instanceof Mobject2D;
    }

    set zIndex(index) {
        this._zIndex = index;
        this.strokes.zIndex = index;
    }

    get zIndex() {
        return this._zIndex;
    }
}

// Helper function
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
