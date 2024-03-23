import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

const vertexShader = `
    attribute vec3 position;

    uniform mat4 viewMat;
    uniform mat4 projectionMat;
    uniform mat4 modelMat;
    uniform float far;
    uniform float near;
    uniform vec3 cameraPos;
    
    varying float v_distance;

    void main() {
        gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
        v_distance = distance(cameraPos, position)  / (near - far) + 1.0;
    }
`;

const fragmentShader = `
    precision mediump float;

    varying float v_distance;

    void main() {
        gl_FragColor.rgb = vec3(1.0,1.0,1.0) * v_distance;
        gl_FragColor.a = 1.0;
    }
`;

export default class DepthMaterial extends Material {
    depthTest = false;

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

    beforeRender(scene) {
        const camera = scene.camera;
        this.program.setUniform("cameraPos", camera.position);
        this.program.setUniform("near", camera.near);
        this.program.setUniform("far", camera.far);
    }
}
