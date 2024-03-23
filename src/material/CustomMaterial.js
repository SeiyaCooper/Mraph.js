import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

export default class CustomMaterial extends Material {
    constructor({ vertexShader = "", fragmentShader = "" } = {}) {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    initProgram(gl) {
        this.program = new WebGLProgram(gl, {
            vs: this.vertexShader,
            fs: this.fragmentShader,
        });
    }
}
