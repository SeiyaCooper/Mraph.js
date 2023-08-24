import Arc from "./Arc.js";
import Matrix from "../math/Matrix.js";

export default class Point extends Arc {
    constructor(...args) {
        super(0, 2 * Math.PI, 0.06);
        if (Matrix.isMatrix(args[0])) {
            this.center = args[0];
        } else if (Array.isArray(args[0])) {
            this.center = new Matrix(args[0]);
        } else {
            this.center = new Matrix(args);
        }
        this.update();
    }
}
