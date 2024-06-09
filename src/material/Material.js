import GetColorComponent from "./components/GetColorComponent.js";
import * as COLORS from "../constants/colors.js";

export default class Material {
    /**
     * Whether to use depth test, true by default.
     * @type {boolean}
     */
    _depthTest = true;

    /**
     * Determines the mode of color, avaible options are 'single', 'texture' and 'vertex'.
     * @type {string}
     */
    colorMode = "single";

    /**
     * Used when color mode is 'single'.
     * @type {Color}
     */
    color = COLORS.WHITE;

    /**
     * Used when color mode is 'texture'.
     */
    diffuseTexture = null;

    /**
     * The code of vertex shader.
     * @type {string}
     */
    vertexShader = "";

    /**
     * The code of fragment shader.
     * @type {string}
     */
    fragmentShader = "";

    /**
     * Components that attatched to this material.s
     * @type {Component}
     */
    components = [];

    constructor() {
        this.attachComponent(new GetColorComponent());
    }

    beforeRender() {}

    attachComponent(component) {
        this.components.push(component);
    }

    compileComponents() {
        let code;
        for (let component of this.components) {
            code = component.compile(this.vertexShader, this.fragmentShader, this);
        }
        return code;
    }

    passComponentVariables() {
        for (let component of this.components) component.passVariables(this);
    }

    set depthTest(val) {
        this._depthTest = val;
    }

    get depthTest() {
        return this._depthTest;
    }
}
