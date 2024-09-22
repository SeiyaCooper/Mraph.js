import * as COLORS from "../../constants/colors.js";
import Color from "../../math/Color.js";
import Arc from "./Arc.js";

export default class Circle extends Arc {
    fillColor = new Color(1, 1, 1, 1);

    /**
     * @param {object} configs
     * @param {Vector | number[]} [configs.center=[0,0,0]]
     * @param {number} [configs.radius=1]
     */
    constructor({ center = [0, 0, 0], radius = 1 } = {}) {
        super(0, 2 * Math.PI, radius);
        this.center = center;
        this.setColor(COLORS.RED.clone(), { fillOpacity: 0.3 });
    }

    update() {
        this.clearGraph();
        this.arc(this.radius, 0, Math.PI * 2, false);
        this.stroke();
        this.fill();
        return this;
    }
}
