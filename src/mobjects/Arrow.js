import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";
import Point from "./Point.js";
import Segment from "./Segment.js";
import Color from "../core/Color.js";

export default class Arrow extends Segment {
    fillColor = new Color(1, 1, 1, 1);

    constructor(...param) {
        if (Vector.isVector(param[1])) {
            super(param[0], new Point(param[0].center.add(param[1])));
            this._vector = param[1];
        } else {
            super(...param);
            this._vector = param[1].center.reduce(param[0].center);
        }
    }

    renderByCanvas2d(renderer) {
        if (!renderer || !this.visible) return this;

        super.renderByCanvas2d(renderer);
        const start = this.start.center;
        const end = this.end.center;
        const vec = start.reduce(end);
        vec.norm = this.strokeWidth * 3;

        renderer.begin();
        renderer.move(end.reduce(vec.normal().mult(0.05)));
        renderer.line3D(end.add(vec.trans(Matrix.rotateZ(Math.PI / 5, 3))));
        renderer.line3D(end.add(vec.trans(Matrix.rotateZ(-Math.PI / 5, 3))));
        renderer.close();
        renderer.fill();

        return this;
    }
}
