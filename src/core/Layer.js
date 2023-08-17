import ActionList from "../animation/ActionList.js";
import WebglRenderer from "../renderer/WebglRenderer.js";
import Camera from "./Camera.js";

export default class Layer {
    elements = [];
    camera = new Camera();
    actionList = new ActionList();

    constructor({
        fillScreen = true,
        appendTo = undefined,
        rendererClass = WebglRenderer,
    } = {}) {
        this.canvas = document.createElement("canvas");

        if (fillScreen) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        if (appendTo) {
            this.appendTo(appendTo);
        }

        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.renderer = new rendererClass(this.canvas);
    }

    appendTo(el) {
        el.appendChild(this.canvas);
        return this;
    }

    add(...els) {
        this.elements.push(...els);
        return this;
    }

    render() {
        for (let el of this.elements) {
            this.renderer.render(el, this.camera);
        }
        return this;
    }

    clear() {
        this.renderer.clear();
    }
}
