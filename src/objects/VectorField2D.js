import Group from "./Group.js";
import Arrow from "./Arrow.js";
import Point from "./Point.js";
import Vector from "../math/Vector.js";
import * as math from "../utils/math.js";

export default class VectorField2D extends Group {
    lengthFunc = (length) => {
        return 50 * math.sigmoid(length / 50);
    };

    constructor(func, xRange = [-400, 400, 100], yRange = [-400, 400, 100]) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.func = func;
    }

    set func(func) {
        this._func = func;

        const xRange = this.xRange;
        const yRange = this.yRange;
        let objs = [];
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                const arrow = new Arrow(
                    new Point(x, y),
                    new Vector(func(x, y))
                );
                arrow.length = this.lengthFunc(arrow.length);
                objs.push(arrow);
            }
        }

        this.objs = objs;
    }

    get func() {
        return this._func;
    }
}
