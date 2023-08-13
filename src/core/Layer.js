import WebglRenderer from "../renderer/WebglRenderer.js";
import ActionList from "../animation/ActionList.js";

export default class Layer {
    elements = [];
    actionList = new ActionList();
    rendererClass = WebglRenderer;

    constructor(canvas) {
        this.canvas = canvas;
    }

    /**
     * @param  {...{render: Function}} drawable
     */
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
        this.renderer.clear(0, 0);
    }

    set canvas(val) {
        this._canvas = val;
        this.renderer = new this.rendererClass(val);

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
