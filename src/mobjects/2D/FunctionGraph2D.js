import Mobject2D from "./Mobject2D.js";

export default class FunctionGraph2D extends Mobject2D {
    constructor({ func = (x) => x, xRange = [-8, 8, 0.1], z = 0 } = {}) {
        super();
        this.xRange = xRange;
        this.func = func;
        this.z = z;
    }

    update() {
        const from = this.xRange[0];
        const to = this.xRange[1];
        const step = this.xRange[2];
        const func = this.func;

        this.clearGraph();
        this.move([from, func(from), this.z]);
        for (let i = from + step; i <= to; i += step) {
            this.line([i, func(i), this.z]);
        }
        this.draw();
        return this;
    }

    draw() {
        this.stroke();
        return this;
    }
}
