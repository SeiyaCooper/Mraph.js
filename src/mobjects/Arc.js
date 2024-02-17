import Graph from "./Graph2D.js";
import Color from "../core/Color.js";

export default class Arc extends Graph {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    fillColor = new Color(0, 0, 0, 0);

    constructor(
        startAng = 0,
        endAng = Math.PI,
        radius = 0.5,
        center = [0, 0, 0]
    ) {
        super();
        this.startAng = startAng;
        this.endAng = endAng;
        this.radius = radius;
        this.center = center;
    }

    update() {
        this.clear();
        this.move(this.center);
        this.arc(
            this.radius,
            this.startAng,
            this.endAng,
            this.startAng > this.endAng
        );
        this.stroke();
        return this;
    }
}
