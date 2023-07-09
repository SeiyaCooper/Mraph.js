import Renderer from "../renderer/Renderer.js";
import Matrix from "../math/Matrix.js";

export default class Layer {
    elements = [];
    matrix = Matrix.identity(4);

    constructor(canvas) {
        this.canvas = canvas;
    }

    draw() {
        for (let e of this.elements) {
            this.renderer.render(e, this.matrix);
        }
    }

    clear() {
        this.renderer.clear();
    }

    set canvas(val) {
        this._canvas = val;
        this.renderer = new Renderer(val);
    }
    get canvas() {
        return this._canvas;
    }
}
