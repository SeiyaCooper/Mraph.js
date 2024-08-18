import * as COLORS from "../../constants/colors.js";
import RegularPolygon from "./RegularPolygon.js";

export default class Square extends RegularPolygon {
    strokeColor = COLORS.BLUE_A.clone();
    fillColor = COLORS.BLUE.clone().withRGBA({ a: 0.3 });

    /**
     * Creates a square.
     * @param {Object} configs
     */
    constructor(configs) {
        configs = { startAngle: Math.PI / 4, ...configs };
        super(4, configs);
    }
}
