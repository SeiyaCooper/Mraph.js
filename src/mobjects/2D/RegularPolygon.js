import Polygon from "./Polygon.js";
import Point from "./Point.js";

export default class RegularPolygon extends Polygon {
    constructor(n = 6) {
        super();
        this.vertexNum = n;
    }

    update() {
        this.vertices = [];
        const angle = (Math.PI * 2) / this.vertexNum;
        for (let i = 0; i < this.vertexNum; i++) {
            this.vertices.push(new Point(Math.cos(angle * i), Math.sin(angle * i)));
        }
        super.update();
    }
}
