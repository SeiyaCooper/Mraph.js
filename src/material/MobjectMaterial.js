import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

const vertexShader = `
    attribute vec3 position;
    attribute vec4 color;

    uniform mat4 viewMat;
    uniform mat4 projectionMat;
    uniform mat4 modelMat;

    varying vec4 v_color;

    void main() {
        gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
        v_color = color;
    }
`;

const fragmentShader = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

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
