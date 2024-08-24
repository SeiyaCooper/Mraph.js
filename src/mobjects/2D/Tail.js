import Mobject2D from "./Mobject2D.js";

export default class Tail extends Mobject2D {
    step = 0;

    constructor(target, { maxLength = 50, maxSteps = 1 } = {}) {
        super();
        this.target = target;
        this.trail = [target.center];
        this.strokeWidth = 0.03;
        this.maxLength = maxLength;
        this.maxSteps = maxSteps;
    }

    update() {
        const trail = this.trail;
        this.step++;

        if (this.step >= this.maxSteps) {
            trail.push(this.target.center);
            this.step = 0;
        }
        if (trail.length >= this.maxLength) trail.shift();

        this.clearGraph();
        for (let step of trail) {
            this.line(step);
        }
        this.line(this.target.center);

        this.stroke();
        return this;
    }
}
