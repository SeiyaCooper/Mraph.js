import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";
import GetColorComponent from "./components/GetColorComponent.js";

import vertexShader from "./shader/mobject_2d.vert?raw";
import fragmentShader from "./shader/mobject_2d.frag?raw";

export default class Mobject2DMaterial extends Material {
    constructor() {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.attachComponent(new GetColorComponent());

        this.depthMask = false;
    }

    initProgram(gl) {
        const { vs, fs } = super.compileComponents();
        this.program = new WebGLProgram(gl, {
            vs,
            fs,
        });
    }

    passVariables({ camera }) {
        this.program.setUniform("aspect", camera.aspect);
        this.passComponentVariables();
    }
}
