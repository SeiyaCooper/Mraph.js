import ActionList from "../animation/ActionList.js";
import WebglRenderer from "../renderer/WebglRenderer.js";
import Camera from "./Camera.js";
import Control from "../extra/Control.js";
import Program from "./Program.js";
import * as COLORS from "../constants/colors.js";

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
            this.canvas.width = 1.5 * window.innerWidth;
            this.canvas.height = 1.5 * window.innerHeight;
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
        }

        if (appendTo) {
            this.appendTo(appendTo);
        }

        this.camera.perspective({
            aspect: this.canvas.width / this.canvas.height,
        });
        this.renderer = new rendererClass(this.canvas);
        this.clear(COLORS.GRAY_E);

        if (!this.renderer.gl) return this;
        this.program = new Program(this.renderer.gl, {
            vs: vertexShader,
            fs: fragmentShader,
            attributes: {
                position: 3,
                color: 4,
            },
        });
    }

    /**
     * append this.canvas to a HTMLElement
     * @param {HTMLElement} el
     * @returns {this}
     */
    appendTo(el) {
        el.appendChild(this.canvas);
        return this;
    }

    /**
     * add mobjects to layer
     * @param  {...mobject} els
     * @returns {this}
     */
    add(...els) {
        this.elements.push(...els);

        for (let el of els) {
            el.layer = this;
            el.gl = this.renderer.gl;
        }

        return this;
    }

    /**
     * render mobjects
     * @returns {this}
     */
    render() {
        this.program.setUniform("cameraMat", this.camera.matrix);
        for (let el of this.elements) {
            if (el.program)
                el.program.setUniform("cameraMat", this.camera.matrix);
            this.renderer.render(el, el.program ?? this.program);
        }
        return this;
    }

    /**
     * clear canvas by a color
     * @param {number[] | Color} [color = COLORS.GRAY_E]
     * @returns {this}
     */
    clear([r, g, b, a] = COLORS.GRAY_E) {
        this.renderer.clear(r, g, b, a);
        return this;
    }

    /**
     * play animation by a refresh color
     * @param {color} [color = COLORS.GRAY_E]
     * @returns {this}
     */
    play(color = COLORS.GRAY_E) {
        const list = this.actionList;
        list.addGlobal({
            update: () => {
                this.clear(color);
                this.render();
            },
        });
        list.play();
        return this;
    }

    /**
     * pause for a while between animations
     * @param {number} [time=1] in seconds
     */
    wait(time = 1) {
        this.actionList.maxTime += time;
        return this;
    }

    /**
     * @returns Control
     */
    enableOrbitControl() {
        const control = new Control(this.camera, { element: this.canvas });
        this.actionList.addInfinity({
            update: () => {
                control.update();
            },
        });
        return control;
    }
}

const vertexShader = `
    attribute vec3 position;
    attribute vec4 color;

    uniform mat4 cameraMat;
    uniform mat4 modelMat;

    varying vec4 v_color;

    void main() {
        gl_Position = cameraMat * modelMat * vec4(position, 1.0);
        v_color = color;
    }
`;

const fragmentShader = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;
