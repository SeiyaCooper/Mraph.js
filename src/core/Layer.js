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
    }) {
        this.canvas = document.createElement("canvas");
        this.renderer = rendererClass(this.canvas);

        if (fillScreen) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        if (appendTo) {
            this.appendTo(appendTo);
        }
    }

    appendTo(el) {
        el.appendChild(this.canvas);
    }

    add(...els) {
        this.elements.push(...els);
    }

    render() {
        for (let el of this.elements) {
            this.renderer.render(el, this.camera);
        }
    }
}
