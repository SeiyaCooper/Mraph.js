import Arrow from "./Arrow.js";
import Point from "./Point.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";
import Color from "../../math/Color.js";
import Geometry from "../../geometry/Geometry.js";

export default class VectorField2D extends Geometry {
    lengthFunc = (length) => {
        return MathFunc.sigmoid(length / 50);
    };
    colorFunc = () => new Color(1, 1, 1);
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
        this.setAttribute("position", [], 3);
        this.setAttribute("color", [], 4);
        this.clear();

        const func = this.func;
        const xRange = this.xRange;
        const yRange = this.yRange;
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                const arrow = new Arrow(
                    new Point(new Vector(x, y, 0).add(this.center)),
                    new Vector(...func(x, y, this.center[2]))
                );
                const length = this.lengthFunc(arrow.length);
                arrow.length = length;
                arrow.setColor(this.colorFunc(x, y, length));
                arrow.update();
                this.add(arrow);
            }
        }

        this.combineChildren();
    }

    set center(center) {
        this._center = center;
        this.update();
    }

    get center() {
        return this._center;
    }
}
