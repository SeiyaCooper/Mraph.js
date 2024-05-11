import * as VECTORS from "../constants/vectors.js";
import * as COLORS from "../constants/colors.js";

export default class DirectionalLight {
    constructor({
        direction = VECTORS.DOWN,
        color = COLORS.WHITE,
        intensity = 1,
    } = {}) {
        this.direction = direction;
        this.color = color;
        this.intensity = intensity;
    }

    static isInstance(obj) {
        return obj instanceof DirectionalLight;
    }
}
