import Graph from "./Graph.js";
import Matrix from "../math/Matrix.js";

export default class Segment extends Graph {
    strokeWidth = 0.05;
    indices = { data: [0, 1, 3, 2, 0, 3] };

    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        this.update();
    }

    update() {
        const start = this.start.pos;
        const end = this.end.pos;
        const vec = end.reduce(start).trans(Matrix.rotateZ(Math.PI / 2));
        vec.norm = this.strokeWidth / 2;

        this.attributes.position.data = [
            start.add(vec)[0].slice(0, -1),
            start.reduce(vec)[0].slice(0, -1),
            end.add(vec)[0].slice(0, -1),
            end.reduce(vec)[0].slice(0, -1),
        ].flat();
    }
}
