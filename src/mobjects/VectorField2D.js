import Arrow from "./Arrow.js";
import Point from "./Point.js";
import Graph from "./Graph.js";
import Vector from "../math/Vector.js";
import * as math from "../utils/math.js";

export default class VectorField2D extends Graph {
    lengthFunc = (length) => {
        return math.sigmoid(length / 50);
    };
    _center = new Vector(0, 0, 0);

    constructor(
        func = (x, y) => {
            return [x, y, 0];
        },
        xRange = [-8, 8, 1],
        yRange = [-4, 4, 1]
    ) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.func = func;
    }

    update() {
        const func = this._func;
        const xRange = this.xRange;
        const yRange = this.yRange;
        let children = [];
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                const arrow = new Arrow(
                    new Point(new Vector(x, y, 0).add(this.center)),
                    new Vector(...func(x, y, this.center[2]))
                );
                arrow.length = this.lengthFunc(arrow.length);
                children.push(arrow);
            }
        }

        this.children = children;
    }

    set func(func) {
        this._func = func;
        this.update();
    }

    get func() {
        return this._func;
    }

    set center(center) {
        this._center = center;
        this.update();
    }

    get center() {
        return this._center;
    }
}
