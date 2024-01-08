import WebGLProgram from "../core/WebGL/WebGLProgram.js";

export default class CustomMaterial {
    constructor({ vertexShader = "", fragmentShader = "" } = {}) {
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
