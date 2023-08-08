import Graph from "./Graph.js";
import Vector from "../math/Vector.js";

export default class Point extends Graph {
    fillColor = "black";
    /**
     * @param {Vector|number[]|...number} pos
     */
    constructor(...args) {
        super();
        if (Vector.isVector(args[0])) {
            this.pos = args[0];
        } else if (Array.isArray(args[0])) {
            this.pos = new Vector(args[0]);
        } else {
            this.pos = new Vector(args);
        }
        this.pos.columns[2] = this.pos.columns[2] ?? 0;
    }

    get path() {
        return [
            ["style", this],
            ["begin"],
            ["arc", [this.pos, this.size, 0, Math.PI * 2]],
            ["close"],
            ["fill"],
        ];
    }
}
