import Renderer from "../renderer/Renderer.js";
import ActionList from "../animation/ActionList.js";

export default class Layer {
    elements = [];
    actionList = new ActionList();

    constructor(canvas) {
        this.canvas = canvas;
    }

    add(...drawable) {
        for (let obj of drawable) {
            this.elements.push(obj);
            obj.renderer = this.renderer;
        }
    }

    render() {
        for (let e of this.elements) {
            e.render();
        }
    }

    clear() {
        this.renderer.clear();
    }

    set canvas(val) {
        this._canvas = val;
        this.renderer = new Renderer(val);

        for (let obj of this.elements) {
            obj.renderer = this.renderer;
        }
    }
    get canvas() {
        return this._canvas;
    }

    set matrix(mat) {
        this.renderer.matrix = mat;
    }
    get matrix() {
        return this.renderer.matrix;
    }
}
