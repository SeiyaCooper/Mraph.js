import Line from "./Line.js";
import * as COLORS from "../../constants/colors.js";

export default class Arrow extends Line {
    /**
     * @param {Point3D | Point2D | number[] | Vector} [start = [-1, 0]]
     * @param {Point3D | Point2D | number[] | Vector} [end = [1, 0]]
     * @returns {Arrow}
     */
    constructor(start = [-1, 0], end = [1, 0]) {
        super(start, end);
        this.addTip(1);
        this.setColor(COLORS.RED, { fillOpacity: 1.0 });
    }
}
