import Arrow3D from "./Arrow3D.js";
import Point3D from "./Point3D.js";
import Vector from "../../math/Vector.js";
import * as MathFunc from "../../math/math_func.js";
import Color from "../../math/Color.js";
import Mobject3D from "./Mobject3D.js";

export default class VectorField3D extends Mobject3D {
    lengthFunc = (length) => {
        return MathFunc.sigmoid(length / 15);
    };
    colorFunc = () => new Color(1, 1, 1);

    constructor({
        func = (x, y, z) => {
            return [x, y, z];
        },
        xRange = [-4, 4, 2],
        yRange = [-4, 4, 2],
        zRange = [-4, 4, 2],
    } = {}) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = zRange;
        this.func = func;
    }

    update() {
        this.setAttribute("position", [], 3);
        this.setAttribute("color", [], 4);
        this.clear();

        const func = this.func;
        const xRange = this.xRange;
        const yRange = this.yRange;
        const zRange = this.zRange;
        const colors = [];
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                for (let z = zRange[0]; z <= zRange[1]; z += zRange[2]) {
                    const arrow = new Arrow3D(new Point3D(new Vector(x, y, z)), new Vector(...func(x, y, z)));
                    const length = this.lengthFunc(arrow.length);
                    arrow.length = length;
                    arrow.update();

                    this.mergeAttributes(arrow, "position", "normal");

                    const color = this.colorFunc(x, y, z, length);
                    for (let i = 0; i < arrow.getAttributeVal("position").length / 3; i++) {
                        colors.push(...color);
                    }
                }
            }
        }

        this.setIndex(this.getAttributeVal("position").length / 3);
        this.setAttribute("color", colors, 4);
    }

    setColor(color) {
        this.colorFunc = () => color;
    }
}
