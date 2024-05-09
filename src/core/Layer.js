import Timeline from "../animation/Timeline.js";
import WebGLRenderer from "./WebGL/WebGLRenderer.js";
import Camera from "./Camera.js";
import OrbitControl from "../extra/OrbitControl.js";
import * as COLORS from "../constants/colors.js";
import BasicMaterial from "../material/BasicMaterial.js";
import PointLight from "../light/PointLight.js";
import DirectionalLight from "../light/DirectionalLight.js";

export default class Layer {
    elements = [];
    camera = new Camera();
    timeline = new Timeline();
    defaultMaterial = new BasicMaterial();
    surroundings = {
        pointLights: [],
        directionalLights: [],
    };

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
     * add mobjects, lights to scene
     * @param  {...mobject | light} els
     * @returns {this}
     */
    add(...els) {
        for (let el of els) {
            if (typeof el.attributes === "object") {
                // if adding a drawable object

                el.set("layer", this);
                el.set("gl", this.renderer.gl);
                this.elements.push(el);
            } else {
                this.addSurrounding(el);
            }
        }

        return this;
    }

    /**
     * Create a mobject or geometry and automatically add it to the layer
     * @param {mobject | geometry} Mobject
     * @param  {...any} params
     */
    create(Mobject, ...params) {
        const mobject = new Mobject(...params);
        this.add(mobject);
        return mobject;
    }

    /**
     * delete mobjects or lgihts
     * @param  {...mobject | light} els
     */
    delete(...els) {
        const elements = this.elements;
        const surroundings = this.surroundings;
        for (let el of els) {
            if (typeof el.attributes === "object")
                elements.splice(elements.indexOf(el), 1);
            else surroundings.splice(surroundings.indexOf(el), 1);
        }
    }

    /**
     * add something to surroundings
     * @param {light} obj
     */
    addSurrounding(obj) {
        if (PointLight.isInstance(obj)) this.surroundings.pointLights.push(obj);
        if (DirectionalLight.isInstance(obj))
            this.surroundings.directionalLights.push(obj);
    }

    /**
     * render mobjects
     * @returns {this}
     */
    render() {
        for (let el of this.elements) {
            if (el.needsUpdate) {
                el.update?.();
                el.updateMatrix?.();
                el.needsUpdate = false;
            }

            const material = el.material ?? this.defaultMaterial;
            this.renderer.render(el, this.camera, material, this.surroundings);
        }
        return this;
    }

    /**
     * clear canvas by a color
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
