import Graph from "./Graph.js";
import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";

export default class Box extends Graph {
    constructor(base, width, height, depth) {
        super();
        this.base = base;
        this.height = height;
        this.width = width;
        this.depth = depth;
    }

    get path() {
        const c = this.center.columns;
        const mat = Matrix.translate(...c).mult(
            this.matrix.mult(Matrix.translate(-c[0], -c[1], -c[2]))
        );
        const BASE = this.base.pos.trans(mat);
        const UP = new Vector([0, this.height, 0, 0]).trans(mat);
        const RIGHT = new Vector([this.width, 0, 0, 0]).trans(mat);
        const IN = new Vector([0, 0, this.depth, 0]).trans(mat);

        return [
            ["style", this],
            ["begin"],
            ["move", BASE],
            ["line", BASE.add(UP)],
            ["line", BASE.add(UP).add(RIGHT)],
            ["line", BASE.add(UP).add(RIGHT).reduce(UP)],
            ["close"],
            ["stroke"],

            ["begin"],
            ["move", BASE.add(IN)],
            ["line", BASE.add(IN).add(UP)],
            ["line", BASE.add(IN).add(UP).add(RIGHT)],
            ["line", BASE.add(IN).add(UP).add(RIGHT).reduce(UP)],
            ["close"],
            ["stroke"],

            ["begin"],
            ["move", BASE],
            ["line", BASE.add(IN)],
            ["stroke"],

            ["begin"],
            ["move", BASE.add(UP)],
            ["line", BASE.add(IN).add(UP)],
            ["stroke"],

            ["begin"],
            ["move", BASE.add(UP).add(RIGHT)],
            ["line", BASE.add(IN).add(UP).add(RIGHT)],
            ["stroke"],

            ["begin"],
            ["move", BASE.add(UP).add(RIGHT).reduce(UP)],
            ["line", BASE.add(IN).add(UP).add(RIGHT).reduce(UP)],
            ["stroke"],
        ];
    }

    get center() {
        const base = this.base.pos;
        return base.add(
            new Vector([this.width / 2, this.height / 2, this.depth / 2, 0])
        );
    }
}
