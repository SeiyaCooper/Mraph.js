import Graph from "./Graph.js";

export default class Arc extends Graph {
    insertNum = 25;
    strokeWidth = 0.05;
    strokeColor = [1, 1, 1, 1];
    fillColor = [0, 0, 0, 1];

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
        this.attributes.position.data = this.updatePosition();
    }

    updatePosition() {
        this.attributes.position.needsUpdate = true;

        const vertices = [...this.center];
        const indices = this.indices.data;
        const color = this.attributes.color.data;
        const sA = this.endAng > this.startAng ? this.startAng : this.endAng;
        const eA = this.endAng > this.startAng ? this.endAng : this.startAng;
        const step = (eA - sA) / this.insertNum;
        const c = this.center;
        let r = this.radius + this.strokeWidth;

        color.push(...this.strokeColor);
        for (let a = sA; a <= eA; a += step) {
            vertices.push(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]);
            color.push(...this.strokeColor);
        }
        vertices.push(c[0] + Math.cos(eA) * r, c[1] + Math.sin(eA) * r, c[2]);
        color.push(...this.strokeColor);

        r -= this.strokeWidth;
        color.push(...this.fillColor);
        vertices.push(...this.center);
        for (let a = sA; a <= eA; a += step) {
            vertices.push(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]);
            color.push(...this.fillColor);
        }
        vertices.push(c[0] + Math.cos(eA) * r, c[1] + Math.sin(eA) * r, c[2]);
        color.push(...this.fillColor);

        const half = vertices.length / 6;
        for (let i = 0; i < vertices.length; i++) {
            indices.push(i);
            if (i % 2 === 0 && i !== 0) {
                if (i <= half) {
                    indices.push(0, i, i + 1, 0);
                } else {
                    indices.push(half, i, i + 1, half);
                }
            }
        }

        return vertices;
    }
}
