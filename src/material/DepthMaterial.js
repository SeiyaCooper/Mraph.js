import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

import vertexShader from "./shader/depth.vert?raw";
import fragmentShader from "./shader/depth.frag?raw";

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
