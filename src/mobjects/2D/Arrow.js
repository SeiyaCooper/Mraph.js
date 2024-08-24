import Vector from "../../math/Vector.js";
import Point from "./Point.js";
import Line from "./Line.js";
import * as COLORS from "../../constants/colors.js";

export default class Arrow extends Line {
    constructor(...param) {
        if (Vector.isInstance(param[1])) {
            if (Array.isArray(param[0])) {
                super(param[0], new Point(param[0].add(param[1])));
            } else {
                super(param[0], new Point(param[0].center.add(param[1])));
            }
        } else {
            super(...param);
        }
        this.addTip(1);
        this.setColor(COLORS.RED);
    }
}
