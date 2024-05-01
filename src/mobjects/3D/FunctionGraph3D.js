import Geometry from "../../geometry/Geometry";
import * as GLENUM from "../../constants/glenum.js";
import BasicMaterial from "../../material/BasicMaterial.js";

export default class FunctionGraph3D extends Geometry {
    material = new BasicMaterial();

    constructor({
        xRange = [-8, 8, 0.5],
        yRange = [-8, 8, 0.5],
        func = (x, y) => x + y,
    } = {}) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.func = func;
    }

    update() {
        const vertices = [];
        const indices = [];
        const xRange = this.xRange;
        const yRange = this.yRange;
        const func = this.func;
        const mode = this.glMode;

        // get vertices
        let xNum = 0,
            yNum = 0;
        for (let x = xRange[0]; x <= xRange[1]; x += xRange[2]) {
            xNum++;
            yNum = 0;
            for (let y = yRange[0]; y <= yRange[1]; y += yRange[2]) {
                yNum++;
                vertices.push(x, func(x, y), y);
            }
        }

        function addPlane(a, b, c, d) {
            if (mode === GLENUM.LINES) {
                indices.push(a, b, c);
                indices.push(b, d, c);
            } else {
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        for (let i = 0; i < xNum - 1; i++) {
            for (let j = 0; j < yNum - 1; j++) {
                const offest = i * yNum;
                const a = offest + j;
                const b = offest + yNum + j;
                const c = offest + yNum + j + 1;
                const d = offest + j + 1;

                addPlane(a, b, c, d);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setIndex(indices);
    }
}
