import Geometry from "../geometry/Geometry.js";
import BasicMaterial from "../material/BasicMaterial.js";

export default class Graph extends Geometry {
    material = new BasicMaterial();

    /**
     * @returns {Graph}
     */
    constructor() {
        super();
        this.material.colorMode = "vertex";
    }

    /**
     * shift this mobject to a new place
     * @param {Vector} pos
     * @param {Object} config
     */
    moveTo(pos, { runTime = 1, curve } = {}) {
        let start;
        const config = {
            start: () => {
                start = this.center;
            },
            update: (p) => {
                this.center = start.lerp(pos, p);
                this.updateMatrix();
            },
            curve,
        };

        this.layer.timeline.addFollow(runTime, config);
    }
}
