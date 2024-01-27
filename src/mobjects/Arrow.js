import Vector from "../math/Vector.js";
import Point from "./Point.js";
import Line from "./Line.js";

export default class Arrow extends Line {
    constructor(...param) {
        if (Vector.isVector(param[1])) {
            super(param[0], new Point(param[0].center.add(param[1])));
        } else {
            super(...param);
        }
        this.addTip(1);
    }
}
