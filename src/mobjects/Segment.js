import Graph from "./Graph.js";

export default class extends Graph {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
}
