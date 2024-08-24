import Color from "../../math/Color.js";
import Mobject2D from "./Mobject2D.js";

export default class Polygon extends Mobject2D {
    fillColor = new Color(0, 0, 0, 0);
    closePath = true;

    constructor(...points) {
        super();
        this.vertices = points;
    }

    update() {
        this.clearGraph();

        for (let point of this.vertices) {
            this.line(point.center);
        }
        this.line(this.vertices[0].center);

        this.stroke();
        this.fill();

        return this;
    }
}
