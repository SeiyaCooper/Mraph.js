import * as VECTORS from "../constants/vectors.js";
import * as COLORS from "../constants/colors.js";

export default class DirectionalLight {
    constructor({ direction = VECTORS.IN, color = COLORS.WHITE } = {}) {
        this.direction = direction;
        this.color = color;
    }

    static isInstance(obj) {
        return obj instanceof DirectionalLight;
    }
}
