import Graph from "./Graph.js";
import Color from "../core/Color.js";
import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";

export default class Graph2D extends Graph {
    _normal = new Vector(0, 0, 1);

    /**
     * @type {Matrix}
     * Cache for rotating matrices around normal vector
     */
    rot90OnNorVec = Matrix.rotateZ(Math.PI / 2, 3);

    _color = new Color(1, 1, 1);
    strokeColor = new Color(1, 1, 1);
    strokeWidth = 0.05;
    fillColor = new Color(1, 1, 1);

    set color(color) {
        this._color = color;
        this.strokeColor = color;
        this.fillColor = color;
    }

    get color() {
        return this._color;
    }

    set normal(vec) {
        this._normal = vec;
        this.rot90OnNorVec = Matrix.rotateOn(vec, Math.PI / 2, 3);
    }
    get normal() {
        return this._normal;
    }
}
