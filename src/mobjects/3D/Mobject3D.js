import Mobject from "../Mobject.js";

export default class Mobject3D extends Mobject {
    /**
     * Sets the color of this mobject
     * @param {Color} color
     */
    setColor(color) {
        this.material.color = color;
    }

    /**
     * Transform into an array that is morphable, in order to perform morph animations.
     * For Mobject3D, there's one polygon that contains all vertices.
     * @returns {number[][][]}
     */
    toMorphable() {
        return [this.attr2Array("position")];
    }

    /**
     * Sets attribute variables from a given morphable array, in order to perform morph animations.
     * @param {number[][][]} morphable
     */
    fromMorphable(morphable) {
        this.array2Attr("position", morphable[0]);
    }
}
