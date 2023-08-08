import Graph from "./Graph.js";
import Vector from "../math/Vector.js";

export default class Box extends Graph {
    constructor(base, width, height, depth) {
        super();
        this.base = base;
        this.height = height;
        this.width = width;
        this.depth = depth;
    }

    get path() {
        const BASE = this.base.pos.trans(this.matrix);
        const UP = new Vector([0, this.height, 0]).trans(this.matrix);
        const RIGHT = new Vector([this.width, 0, 0]).trans(this.matrix);
        const IN = new Vector([0, 0, this.depth]).trans(this.matrix);

        return [
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
}
