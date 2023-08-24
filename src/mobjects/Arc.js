import Graph from "./Graph.js";
import Segment from "./Segment.js";
import Matrix from "../math/Matrix.js";

export default class Arc extends Graph {
    mode = "TRIANGLE_FAN";
    insertNum = 25;
    strokeWidth = 0.05;
    strokeColor = [1, 1, 1, 1];
    fillColor = [0, 0, 0, 0];

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
        this.update();
    }

    update() {
        this.attributes.position.needsUpdate = true;

        const vertices = [...this.center];
        const color = [...this.fillColor];
        const points = [];
        const segments = [];
        const sA = this.endAng > this.startAng ? this.startAng : this.endAng;
        const eA = this.endAng > this.startAng ? this.endAng : this.startAng;
        const step = (eA - sA) / this.insertNum;
        const c = this.center;
        const r = this.radius;

        for (let a = sA; a <= eA; a += step) {
            vertices.push(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]);
            points.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]]);
            color.push(...this.fillColor);
        }
        vertices.push(c[0] + Math.cos(eA) * r, c[1] + Math.sin(eA) * r, c[2]);
        points.push([c[0] + Math.cos(eA) * r, c[1] + Math.sin(eA) * r, c[2]]);
        color.push(...this.fillColor);

        for (let i = 0; i < points.length - 1; i++) {
            const segment = new Segment(
                { center: new Matrix(points[i]) },
                { center: new Matrix(points[i + 1]) }
            );
            segment.strokeWidth = this.strokeWidth;
            segment.strokeColor = this.strokeColor;
            segment.update();
            segments.push(segment);
        }

        this.indices = vertices.length / 3;
        this.attributes.position.data = vertices;
        this.attributes.color.data = color;
        this.children = segments;
    }
}
