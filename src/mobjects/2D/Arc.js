import Mobject2D from "./Mobject2D.js";
import Color from "../../math/Color.js";

export default class Arc extends Mobject2D {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    fillColor = new Color(0, 0, 0, 0);

    constructor(startAngle = 0, endAngle = Math.PI, radius = 1, center = [0, 0, 0]) {
        super();
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.radius = radius;
        this.center = center;
    }

    update() {
        this.clearGraph();
        this.arc(this.radius, this.startAngle, this.endAngle, this.startAngle > this.endAngle);
        this.stroke();
        return this;
    }
}
