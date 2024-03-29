import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Color from "../core/Color.js";
import Material from "./Material.js";

const vertexShader = `
    attribute vec3 position;

    uniform mat4 viewMat;
    uniform mat4 projectionMat;
    uniform mat4 modelMat;

    void main() {
        gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    precision mediump float;

    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }
`;

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
