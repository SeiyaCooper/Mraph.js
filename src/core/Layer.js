import Timeline from "../animation/Timeline.js";
import WebGLRenderer from "./WebGL/WebGLRenderer.js";
import Camera from "./Camera.js";
import OrbitControl from "../extra/OrbitControl.js";
import Subscriber from "../animation/Subscriber.js";
import * as COLORS from "../constants/colors.js";
import MobjectMaterial from "../material/MobjectMaterial.js";

export default class Layer {
    elements = [];
    camera = new Camera();
    timeline = new Timeline();
    defaultMaterial = new MobjectMaterial();

    constructor({
        fillScreen = true,
        appendTo = undefined,
        rendererClass = WebGLRenderer,
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
            if (this.renderer.gl) {
                el.gl = this.renderer.gl;
            }
        }

        return this;
    }

    /**
     * create a mobject
     * @param {function} mobjClass constructor of this mobject
     * @param {any} [...attrs]
     * @returns {this}
     */
    create(mobjClass, ...attrs) {
        const mobj = new mobjClass(...attrs);
        this.add(mobj);
        return Subscriber.watch(
            mobj,
            {
                set: () => {
                    mobj.needsUpdate = true;
                },
            },
            {
                whiteList: mobj.watchList ?? [],
            }
        );
    }

    /**
     * render mobjects
     * @returns {this}
     */
    render() {
        for (let el of this.elements) {
            if (el.needsUpdate) {
                el.update?.();
                el.needsUpdate = false;
            }

            const material = el.material ?? this.defaultMaterial;
            this.renderer.render(el, this.camera, material);
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
     * play animation with a refresh color
     * @param {Color} [color = COLORS.GRAY_E]
     * @returns {this}
     */
    play(color = COLORS.GRAY_E) {
        const timeline = this.timeline;
        timeline.addGlobal({
            update: () => {
                this.clear(color);
                this.render();
            },
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
        this.timeline.addInfinity({
            update: () => {
                control.update();
            },
        });
        return control;
    }
}
