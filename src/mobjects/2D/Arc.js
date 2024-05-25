import Mobject2D from "./Mobject2D.js";
import Color from "../../math/Color.js";

export default class Arc extends Mobject2D {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    fillColor = new Color(0, 0, 0, 0);

    constructor(
        startAng = 0,
        endAng = Math.PI,
        radius = 1,
        center = [0, 0, 0]
    ) {
        super();
        this.startAng = startAng;
        this.endAng = endAng;
        this.radius = radius;
        this.center = center;
    }

    update() {
        this.clearGraph();
        this.arc(
            this.radius,
            this.startAng,
            this.endAng,
            this.startAng > this.endAng
        );
        this.draw();
        return this;
    }

    draw() {
        this.stroke();
        return this;
    }
}
