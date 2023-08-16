import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";
import Point from "./Point.js";
import Segment from "./Segment.js";

export default class Arrow extends Segment {
    fillColor = "black";

    constructor(...param) {
        if (Vector.isVector(param[1])) {
            super(param[0], new Point(param[0].pos.add(param[1])));
            this._vector = param[1];
        } else {
            super(...param);
            this._vector = param[1].pos.reduce(param[0].pos);
        }
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        super.render();
        const renderer = this.renderer;
        const start = this.start.pos;
        const end = this.end.pos;
        const vec = start.reduce(end);
        vec.length = this.strokeWidth * 3;

        renderer.begin();
        renderer.move(end.reduce(vec.normal().mult(5)));
        renderer.line3D(end.add(vec.trans(Matrix.rotateZ(Math.PI / 5))));
        renderer.line3D(end.add(vec.trans(Matrix.rotateZ(-Math.PI / 5))));
        renderer.close();
        renderer.fill();

        return this;
    }
}
