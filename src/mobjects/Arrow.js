import Vector from "../math/Vector.js";
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
        this.addTip(1);
    }
}
