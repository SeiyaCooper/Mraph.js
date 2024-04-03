import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

import vertexShader from "./shader/mobject.vert?raw";
import fragmentShader from "./shader/mobject.frag?raw";

export default class MobjectMaterial extends Material {
    constructor() {
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
