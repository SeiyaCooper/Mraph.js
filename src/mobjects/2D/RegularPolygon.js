import Polygon from "./Polygon.js";
import Point from "./Point.js";

export default class RegularPolygon extends Polygon {
    /**
     * @param {number} n
     * @param {Object} configs
     */
    constructor(n = 6, { sideLength = 1, startAngle = 0 } = {}) {
        super();
        this.vertexNum = n;
        this.sideLength = sideLength;
        this.startAngle = startAngle;
    }

    update() {
        const angleUnit = (Math.PI * 2) / this.vertexNum;
        const len = this.sideLength;

        this.vertices = [];
        for (let i = 0; i < this.vertexNum; i++) {
            const angle = this.startAngle + i * angleUnit;
            this.vertices.push(new Point(Math.cos(angle) * len, Math.sin(angle) * len));
        }

        super.update();
    }
}
