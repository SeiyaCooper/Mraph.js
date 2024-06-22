import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";
import GetColorComponent from "./components/GetColorComponent.js";

import vertexShader from "./shader/basic.vert?raw";
import fragmentShader from "./shader/basic.frag?raw";

export default class BasicMaterial extends Material {
    constructor() {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.attachComponent(new GetColorComponent());
    }

    initProgram(gl) {
        const { vs, fs } = super.compileComponents();
        this.program = new WebGLProgram(gl, {
            vs,
            fs,
        });
    }

    passVariables() {
        this.passComponentVariables();
    }
}
