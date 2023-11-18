import Graph2D from "../Graph2D.js";
import Line from "./Line.js";
import Vector from "../../math/Vector.js";
import Color from "../../core/Color.js";

export default class Arc extends Graph2D {
    mode = "TRIANGLE_FAN";
    insertNum = 25;
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
        this.attributes.position.needsUpdate = true;

        const vertices = [...this.center];
        const color = [...this.fillColor];
        const segments = [];
        const sA = this.endAng > this.startAng ? this.startAng : this.endAng;
        const eA = this.endAng > this.startAng ? this.endAng : this.startAng;
        const step = (eA - sA) / this.insertNum;
        const c = this.center;
        const r = this.radius;

        for (let a = sA; a <= eA; a += step) {
            vertices.push(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]);
            color.push(...this.fillColor);
        }
        vertices.push(c[0] + Math.cos(eA) * r, c[1] + Math.sin(eA) * r, c[2]);
        color.push(...this.fillColor);

        for (let i = 3; i < vertices.length - 2; i += 3) {
            const segment = new Line(
                { center: new Vector(...vertices.slice(i, i + 3)) },
                { center: new Vector(...vertices.slice(i + 3, i + 6)) }
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
