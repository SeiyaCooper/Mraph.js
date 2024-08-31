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
     * Array to store all drawing commands.
     * Each command corresponds to a polygon by its index in the array.
     * @type {string[][]}
     */
    commands = [];

    /**
     * The color used for filling the polygons.
     * @type {Color}
     */
    fillColor = new Color(1, 1, 1, 1);

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
     * @param {number[][]} [polygon] - polygon you want to fill with, will be the last one when left null.
     * @param {Object} [configs={}]
     * @param {boolean} [configs.updateCommand=true] - whether adds a "fill" command to commands list.
     */
    fill(polygon, { updateCommand = true } = {}) {
        if (this.points.length !== 0) this.finish();

        const vertices = this.getAttributeVal("position") ?? [];
        const colors = this.getAttributeVal("color") ?? [];

        polygon = polygon ?? this.polygons[this.polygons.length - 1];
        if (polygon.length < 3) return;

        const first = polygon[0];
        for (let i = 1; i < polygon.length - 1; i++) {
            vertices.push(...first);
            vertices.push(...polygon[i]);
            vertices.push(...polygon[i + 1]);
            colors.push(...this.fillColor);
            colors.push(...this.fillColor);
            colors.push(...this.fillColor);
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setIndex(vertices.length / 3);

        if (updateCommand) this.addPolygonCommand(polygon, "fill");
    }

    /**
     * Strokes a polygon you've drawn.
     * @param {number[][]} [polygon] - polygon you want to fill with, will be the last one when left null.
     * @param {Object} [configs={}]
     * @param {boolean} [configs.updateCommand=true] - whether adds a "stroke" command to commands list.
     */
    stroke(polygon, { updateCommand = true } = {}) {
        if (this.points.length !== 0) this.finish();

        const strokes = this.strokes;
        const reverse = strokes.getAttributeVal("reverse") ?? [];
        const vertices = strokes.getAttributeVal("position") ?? [];
        const previous = strokes.getAttributeVal("previous") ?? [];
        const colors = strokes.getAttributeVal("color") ?? [];

        polygon = polygon ?? this.polygons[this.polygons.length - 1];
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

        strokes.setAttribute("position", vertices, 3);
        strokes.setAttribute("previous", previous, 3);
        strokes.setAttribute("reverse", reverse, 1);
        strokes.setAttribute("color", colors, 4);
        strokes.setUniform("thickness", this.strokeWidth);
        strokes.setIndex(strokes.getAttributeVal("position").length / 3);

        if (updateCommand) this.addPolygonCommand(polygon, "stroke");
    }

    /**
     * Adds a command to a polygon in the list of commands.
     * If the polygon does not exist in the commands list, it is added.
     *
     * @param {number[][]} polygon - A 2D array representing the vertices of the polygon.
     * @param {string} command - The command to be associated with the polygon.
     *
     * This method first checks if the polygon is already present in the commands array.
     * If it is, the command is added to the existing list of commands for that polygon.
     * If not, a new entry is created in the commands array for the polygon with the command.
     * The index of the polygon in the commands array is used to determine the correct location.
     * For new commands, ensuring that commands for the same polygon are grouped together.
     */
    addPolygonCommand(polygon, command) {
        let index = this.commands.indexOf(polygon);
        index = index > 0 ? index : this.commands.length;

        const newCommands = this.commands[index] ?? [];
        newCommands.push(command);
        this.commands[index] = newCommands;
    }

    /**
     * Redraws all the polygons according to their associated commands.
     * This method is very useful when performing deformations.
     */
    redraw() {
        this.clearBuffers();
        this.commands.forEach((polygonCommands, index) => {
            for (let command of polygonCommands) {
                this[command]?.(this.polygons[index], { updateCommand: false });
            }
        });
    }

    /**
     * @param {number} segmentsNum
     */
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
        this.commands = [];
    }

    clearBuffers() {
        this.clearAttributes();
        this.strokes.clearAttributes();
    }

    finish() {
        this.polygons.push(Utils.deepCopy(this.points));
        this.points = [];
    }

    setColor(color) {
        this.strokeColor = color;
        this.fillColor = color;
    }

    toMorphable() {
        return this.polygons;
    }

    fromMorphable(morphable) {
        const colors = this.getAttributeVal("color");
        const strokeColors = this.strokes.getAttributeVal("color");

        this.clearBuffers();

        if (colors) this.setAttribute("color", colors, 4);
        if (strokeColors) this.strokes.setAttribute("color", strokeColors, 4);

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
