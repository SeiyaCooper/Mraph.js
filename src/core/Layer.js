import WebGLRenderer from "./WebGL/WebGLRenderer.js";
import Camera from "./Camera.js";
import * as COLORS from "../constants/colors.js";
import PointLight from "../light/PointLight.js";
import DirectionalLight from "../light/DirectionalLight.js";
import Node from "./Node.js";
import Geomtry from "../geometry/Geometry.js";

export default class Layer {
    camera = new Camera();

    surroundings = {
        pointLights: [],
        directionalLights: [],
    };
    scene = new Node();

    clearColor = COLORS.GRAY_E;

    constructor({ fullScreen = true, appendTo = undefined, rendererClass = WebGLRenderer, contextConfig = {} } = {}) {
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
        this.scene.layer = this;
        this.camera.layer = this;
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
     * Adds a mobject or light to this scene
     * @param  {Mobject | Light} object
     * @returns {this}
     */
    add(object, { initialUpdate = true } = {}) {
        if (object instanceof Geomtry) {
            object.set("layer", this);
            this.scene.add(object);

            if (!initialUpdate) return this;
            object.traverse((node) => {
                node.update?.();
            });
        } else {
            this.addSurrounding(object);
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
            if (typeof el.attributes === "object") scene.delete(el);
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
     * Adds something to surroundings, e.g. Lights
     * @param {Light} obj
     */
    addSurrounding(obj) {
        if (PointLight.isInstance(obj)) this.surroundings.pointLights.push(obj);
        if (DirectionalLight.isInstance(obj)) this.surroundings.directionalLights.push(obj);
    }

    /**
     * Renders scene
     * @returns {this}
     */
    render() {
        this.scene.traverse((node) => {
            if (node.needsUpdateMatrix) {
                node.updateMatrix?.();
                node.needsUpdateMatrix = false;
            }
        });
        this.renderer.render(this.scene, this.camera, this.surroundings);
        return this;
    }

    /**
     * Clears canvas use this.clearColor
     * @returns {this}
     */
    clearCanvas() {
        this.renderer.clear(...this.clearColor);
        return this;
    }

    /**
     * Re-renders this layer
     */
    redraw() {
        this.clearCanvas(this.clearColor);
        this.render();
    }
}
