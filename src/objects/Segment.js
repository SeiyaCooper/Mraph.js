import Graph from "./Graph.js";

export default class Segment extends Graph {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        const renderer = this.renderer;
        renderer.style(this);
        renderer.begin();
        renderer.move(this.start.pos);
        renderer.line3D(this.end.pos);
        renderer.stroke();

        return this;
    }
}
