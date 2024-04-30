import * as VECTORS from "../constants/vectors.js";
import * as COLORS from "../constants/colors.js";

export default class PointLight {
    constructor({
        position = VECTORS.UP,
        color = COLORS.WHITE,
        intensity = 1.5,
    } = {}) {
        this.position = position;
        this.color = color;
        this.intensity = intensity;
    }

    static isInstance(obj) {
        return obj instanceof PointLight;
    }
}
