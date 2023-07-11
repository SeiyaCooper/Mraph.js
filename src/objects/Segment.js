import Graph from "./Graph.js";

export default class Segment extends Graph {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    get path() {
        return [
            ["begin"],
            ["move", this.start.pos],
            ["line", this.end.pos],
            ["close"],
            ["stroke"],
        ];
    }
}
