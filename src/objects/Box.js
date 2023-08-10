import Graph from "./Graph.js";
// import Vector from "../math/Vector.js";

export default class Box extends Graph {
    constructor(base, width, height, depth) {
        super();
        this.base = base;
        this.height = height;
        this.width = width;
        this.depth = depth;
    }

    /*get path() {
        const mat = this.matrix;
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
            ["fill"],

            ["begin"],
            ["move", BASE.add(IN)],
            ["line", BASE.add(IN).add(UP)],
            ["line", BASE.add(IN).add(UP).add(RIGHT)],
            ["line", BASE.add(IN).add(UP).add(RIGHT).reduce(UP)],
            ["close"],
            ["stroke"],
            ["fill"],

            ["begin"],
            ["move", BASE.add(IN)],
            ["line", BASE.add(IN).add(UP)],
            ["line", BASE.add(IN).add(UP).reduce(IN)],
            ["line", BASE.add(IN).add(UP).reduce(IN).reduce(UP)],
            ["close"],
            ["stroke"],
            ["fill"],

            ["begin"],
            ["move", BASE.add(RIGHT).add(IN)],
            ["line", BASE.add(RIGHT).add(IN).add(UP)],
            ["line", BASE.add(RIGHT).add(IN).add(UP).reduce(IN)],
            ["line", BASE.add(RIGHT).add(IN).add(UP).reduce(IN).reduce(UP)],
            ["close"],
            ["stroke"],
            ["fill"],

            ["begin"],
            ["move", BASE.add(IN)],
            ["line", BASE.add(IN).add(RIGHT)],
            ["line", BASE.add(IN).add(RIGHT).reduce(IN)],
            ["line", BASE.add(IN).add(RIGHT).reduce(IN).reduce(RIGHT)],
            ["close"],
            ["stroke"],
            ["fill"],

            ["begin"],
            ["move", BASE.add(UP).add(IN)],
            ["line", BASE.add(UP).add(IN).add(RIGHT)],
            ["line", BASE.add(UP).add(IN).add(RIGHT).reduce(IN)],
            ["line", BASE.add(UP).add(IN).add(RIGHT).reduce(IN).reduce(RIGHT)],
            ["close"],
            ["stroke"],
            ["fill"],
        ];
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        const renderer = this.renderer;
        const mat = this.matrix;
        const UP = new Vector([0, this.height, 0, 0]).trans(mat);
        const RIGHT = new Vector([this.width, 0, 0, 0]).trans(mat);
        const IN = new Vector([0, 0, this.depth, 0]).trans(mat);

        const DLO = this.base.pos.trans(mat);
        const DLI = BASE.add(IN);
        const DRO = BASE.add(RIGHT);
        const DRI = DRO.add(IN);
        const ULO = BASE.add(UP);
        const ULI = ULO.add(IN);
        const URO = ULO.add(RIGHT);
        const URI = URO.add(IN);

        renderer.style(this);
        renderer.begin();
        renderer.move(DLO);
        renderer.line(DRO);
        renderer.line(URO);
        renderer.line(ULO);
        renderer.close();
        renderer.stroke();
    }

    get center() {
        const base = this.base.pos;
        return base.add(
            new Vector([this.width / 2, this.height / 2, this.depth / 2, 0])
        );
    }*/
}
