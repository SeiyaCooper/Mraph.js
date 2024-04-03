import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Color from "../math/Color.js";
import Material from "./Material.js";

import vertexShader from "./shader/basic.vert?raw";
import fragmentShader from "./shader/basic.frag?raw";

export default class BasicMaterial extends Material {
    constructor({ color = new Color(1, 1, 1, 1) } = {}) {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.color = color;
    }

    initProgram(gl) {
        this.program = new WebGLProgram(gl, {
            vs: this.vertexShader,
            fs: this.fragmentShader,
            attributes: {
                position: 3,
            },
            uniforms: {
                color: this.color,
            },
        });
    }

    get depthTest() {
        return this.color.a === 1 ? false : true;
    }
}
