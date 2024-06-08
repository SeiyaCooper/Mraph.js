import Mobject from "../Mobject.js";

export default class Mobject3D extends Mobject {
    /**
     * Sets the color of this mobject
     * @param {Color} color
     */
    setColor(color) {
        this.material.color = color;
    }
}
