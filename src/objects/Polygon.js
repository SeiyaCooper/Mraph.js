import Graph from "./Graph.js";

export default class Polygon extends Graph {
    constructor(...points) {
        super();
        this.points = points;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        const renderer = this.renderer;
        renderer.style(this);
        renderer.begin();
        renderer.move(this.points[0].pos);
        for (let point of this.points) {
            renderer.line3D(point.pos);
        }
        renderer.close();
        renderer.stroke();
        renderer.fill();

        return this;
    }
}
