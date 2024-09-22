import Arrow from "./Arrow.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";
import Color from "../../math/Color.js";
import Mobject2D from "./Mobject2D.js";
import * as COLORS from "../../constants/colors.js";

export default class VectorField2D extends Mobject2D {
    lengthFunc = (length) => {
        return MathFunc.sigmoid(length / 10);
    };
    colorFunc = (x, y, length) => Color.interpolate([COLORS.GREEN, COLORS.YELLOW, COLORS.RED], length / 10);
    _center = new Vector(0, 0, 0);

    constructor({
        func = (x, y) => {
            return [x, y, 0];
        },
        xRange = [-8, 8, 1],
        yRange = [-4, 4, 1],
    } = {}) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.func = func;
    }

    update() {
        this.clearGraph();

        const strokes = this.strokes;
        const func = this.func;
        const xRange = this.xRange;
        const yRange = this.yRange;
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                const arrow = new Arrow(new Vector(x, y, 0), new Vector(...func(x, y, this.center[2])));
                const length = arrow.length;
                arrow.setColor(this.colorFunc(x, y, length));
                arrow.length = this.lengthFunc(length);
                arrow.update();

                this.mergeAttributes(arrow, "position", "color");
                this.polygons = this.polygons.concat(arrow.polygons);
                this.colors = this.colors.concat(arrow.colors);
                strokes.mergeAttributes(arrow.strokes, "position", "previous", "reverse", "color");
            }
        }

        this.setIndex(this.getAttributeVal("position").length / 3);
        strokes.setUniform("thickness", this.strokeWidth);
        strokes.setIndex(strokes.getAttributeVal("position").length / 3);
    }

    setColor(color) {
        this.colorFunc = () => color;
    }
}
