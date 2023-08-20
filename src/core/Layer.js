import ActionList from "../animation/ActionList.js";
import WebglRenderer from "../renderer/WebglRenderer.js";
import Camera from "./Camera.js";
import Program from "./Program.js";

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

        this.camera.perspective({
            aspect: this.canvas.width / this.canvas.height,
        });
        this.renderer = new rendererClass(this.canvas);
        this.program = new Program(this.renderer.gl, {
            vs: vertexShader,
            fs: fragmentShader,
            attributes: {
                position: 4,
                color: 3,
            },
        });
    }

    appendTo(el) {
        el.appendChild(this.canvas);
        return this;
    }

    add(...els) {
        this.elements.push(...els);

        for (let el of els) {
            el.gl = this.renderer.gl;
        }

        return this;
    }

    render() {
        this.program.setUniform("cameraMat", this.camera.matrix);
        for (let el of this.elements) {
            this.renderer.render(el, this.program);
        }
        return this;
    }

    clear(r = 0, g = 0, b = 0, a = 1) {
        this.renderer.clear(r, g, b, a);
        return this;
    }
}

const vertexShader = `
    attribute vec4 position;
    attribute vec3 color;

    uniform mat4 cameraMat;
    uniform mat4 modelMat;

    varying vec3 v_color;

    void main() {
        gl_Position = cameraMat * modelMat * position;
        v_color = color;
    }
`;

const fragmentShader = `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor.rgb = v_color;
    }
`;
