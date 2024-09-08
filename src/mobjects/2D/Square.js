import * as COLORS from "../../constants/colors.js";
import RegularPolygon from "./RegularPolygon.js";

export default class Square extends RegularPolygon {
    /**
     * Creates a square.
     * @param {Object} configs
     */
    constructor(configs) {
        configs = { startAngle: Math.PI / 4, ...configs };
        super(4, configs);
        this.setColor(COLORS.BLUE.clone());
    }
}
