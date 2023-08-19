import Graph from "./Graph.js";
import Matrix from "../math/Matrix.js";

export default class Segment extends Graph {
    strokeWidth = 0.05;
    indices = { type: "UNSIGNED_SHORT", data: [0, 1, 3, 2, 0, 3] };

    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        Object.defineProperty(this.attributes, "position", {
            get: () => {
                const start = this.start.pos;
                const end = this.end.pos;
                const vec = end
                    .reduce(start)
                    .trans(Matrix.rotateZ(Math.PI / 2));
                vec.norm = this.strokeWidth / 2;

                return [
                    start.add(vec),
                    start.reduce(vec),
                    end.add(vec),
                    end.reduce(vec),
                ].flat(2);
            },
        });
    }
}
