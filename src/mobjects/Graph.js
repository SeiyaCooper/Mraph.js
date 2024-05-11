import Geometry from "../geometry/Geometry.js";

export default class Graph extends Geometry {
    /**
     * shift this mobject to a new place
     * @param {Vector} pos
     * @param {Object} config
     */
    moveTo(pos, { runTime = 1, curve } = {}) {
        let start;
        const handler = {
            start: () => {
                start = this.center;
            },
            update: (p) => {
                this.center = start.lerp(pos, p);
                this.updateMatrix();
            },
        };

        this.layer.timeline.addFollow(runTime, handler, {
            curve,
        });
    }
}
