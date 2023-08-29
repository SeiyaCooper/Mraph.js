import Arrow from "./Arrow.js";

export default class NumberLine extends Arrow {
    constructor(start, end, { unit = 1 } = {}) {
        super(start, end);
        this.unit = unit;
    }
    renderByCanvas2d() {
        super.renderByCanvas2d();
    }
}
