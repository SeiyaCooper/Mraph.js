import Timeline from "../animation/Timeline.js";
import WebGLRenderer from "./WebGL/WebGLRenderer.js";
import Camera from "./Camera.js";
import OrbitControl from "../extra/OrbitControl.js";
import * as COLORS from "../constants/colors.js";
import BasicMaterial from "../material/BasicMaterial.js";
import PointLight from "../light/PointLight.js";
import DirectionalLight from "../light/DirectionalLight.js";
import Node from "./Node.js";

export default class Layer {
    camera = new Camera();
    timeline = new Timeline();
    defaultMaterial = new BasicMaterial();
    surroundings = {
        pointLights: [],
        directionalLights: [],
    };
    scene = new Node();

    constructor({
        fullScreen = true,
        appendTo = undefined,
        rendererClass = WebGLRenderer,
        contextConfig = {},
    } = {}) {
        this.canvas = document.createElement("canvas");

        if (fullScreen) {
            this.fillScreen();
            window.addEventListener("resize", () => {
                this.fillScreen();
            });
        }

        if (appendTo) {
            this.appendTo(appendTo);
        }
        this.renderer = new rendererClass(this.canvas, contextConfig);
        this.clearCanvas(COLORS.GRAY_E);
        this.defaultMaterial.colorMode = "vertex";
    }

    /**
     * Adjust the canvas to the new width and height
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.camera.perspective({
            aspect: this.canvas.width / this.canvas.height,
        });
        this.renderer?.resize(width, height);
    }

    /**
     * Adjust the canvas to full screen
     */
    fillScreen() {
        this.resize(1.5 * window.innerWidth, 1.5 * window.innerHeight);
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.display = "block";
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
     * Adds mobjects, lights to scene
     * @param  {...Mobject | Light} els
     * @returns {this}
     */
    add(...els) {
        for (let el of els) {
            if (typeof el.attributes === "object") {
                // if adding a drawable object
                el.set("layer", this);
                this.scene.add(el);
            } else {
                this.addSurrounding(el);
            }
        }

        return this;
    }

    /**
     * Creates a mobject or geometry and automatically add it to the layer
     * @template Mobject
     * @param {Function} Mobject constructor of the mobject you want to create
     * @param  {...any} params
     * @returns {Mobject}
     */
    create(Mobject, ...params) {
        const mobject = new Mobject(...params);
        this.add(mobject);
        return mobject;
    }

    /**
     * Deletes mobjects or lgihts
     * @param  {...Mobject | Light} els
     */
    delete(...els) {
        const scene = this.scene;
        const surroundings = this.surroundings;
        for (let el of els) {
            if (typeof el.attributes === "object")
                scene.splice(scene.indexOf(el), 1);
            else surroundings.splice(surroundings.indexOf(el), 1);
        }
    }

    /**
     * Clears all mobjects and lights
     */
    clear() {
        this.scene.clear();
        this.surroundings.pointLights = [];
        this.surroundings.directionalLights = [];
    }

    /**
     * Sets attributes for all nodes
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        for (let node of this.scene) {
            node.set(key, value);
        }
    }

    /**
     * Adds something to surroundings, e.g. Lights
     * @param {Light} obj
     */
    addSurrounding(obj) {
        if (PointLight.isInstance(obj)) this.surroundings.pointLights.push(obj);
        if (DirectionalLight.isInstance(obj))
            this.surroundings.directionalLights.push(obj);
    }

    /**
     * Renders scene
     * @returns {this}
     */
    render() {
        for (let el of this.scene.children) {
            if (el.needsUpdate) {
                el.update?.();
                el.updateMatrix?.();
                el.needsUpdate = false;
            }
            this.renderer.render(el, this.camera, this.surroundings);
        }
        return this;
    }

    /**
     * Clears canvas by a color
     * @param {number[] | Color} [color = COLORS.GRAY_E]
     * @returns {this}
     */
    clearCanvas([r, g, b, a] = COLORS.GRAY_E) {
        this.renderer.clear(r, g, b, a);
        return this;
    }

    /**
     * play animation with a refresh color
     * @param {Color} [color = COLORS.GRAY_E]
     * @returns {this}
     */
    play(color = COLORS.GRAY_E) {
        const timeline = this.timeline;
        timeline.addGlobal(() => {
            this.clearCanvas(color);
            this.render();
        });
        timeline.play();
        return this;
    }

    /**
     * pause for a while between animations
     * @param {number} [time=1] in seconds
     */
    wait(time = 1) {
        this.timeline.maxTime += time;
        return this;
    }

    /**
     * Enables orbit control
     * @returns Control
     */
    enableOrbitControl() {
        const control = new OrbitControl(this.camera, { element: this.canvas });
        this.timeline.addInfinity(() => {
            control.update();
        });
        return control;
    }
}
