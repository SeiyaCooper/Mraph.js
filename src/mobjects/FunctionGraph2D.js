import Graph2D from "./Graph2D.js";

export default class FunctionGraph2D extends Graph2D {
    constructor(func = (x) => x, { xRange = [-8, 8, 0.1] } = {}) {
        super();
        this.xRange = xRange;
        this.func = func;
    }

    update() {
        const from = this.xRange[0];
        const to = this.xRange[1];
        const step = this.xRange[2];
        const func = this.func;

        this.clear();
        this.move([from, func(from), 0]);
        for (let i = from + step; i <= to; i += step) {
            this.line([i, func(i), 0]);
        }
        this.stroke();
        return this;
    }

    redraw() {
        this.stroke();
        return this;
    }
}
