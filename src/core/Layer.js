import Renderer from "../renderer/Renderer.js";
import Matrix from "../math/Matrix.js";
import ActionList from "../animation/ActionList.js";

export default class Layer {
    elements = [];
    matrix = Matrix.identity(4);
    actionList = new ActionList();

    constructor(canvas) {
        this.canvas = canvas;
    }

    add(...drawable) {
        for (let obj of drawable) {
            this.elements.push(obj);
        }
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
