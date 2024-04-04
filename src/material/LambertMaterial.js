import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";

import vertexShader from "./shader/lambert.vert?raw";
import fragmentShader from "./shader/lambert.frag?raw";

export default class LambertMaterial extends Material {
    constructor() {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    initProgram(gl, { surroundings }) {
        const findSlot = /!slot::([0-9a-zA-Z-_]+)/g;
        const finalFragCode = this.fragmentShader.replace(findSlot, () => {
            return surroundings.pointLights.length;
        });

        this.program = new WebGLProgram(gl, {
            vs: this.vertexShader,
            fs: finalFragCode,
        });
    }

    beforeRender({ surroundings }) {
        const program = this.program;

        const pointLights = surroundings.pointLights;

        if (pointLights.length < 1) return;
        const pointLightsPosition = [];
        const pointLightsColor = [];
        const pointLightsIntensity = [];
        for (let light of pointLights) {
            pointLightsPosition.push(...light.position);
            pointLightsColor.push(...light.color);
            pointLightsIntensity.push(light.intensity);
        }
        program.setUniform("point_light_position", pointLightsPosition, 3);
        program.setUniform("point_light_color", pointLightsColor, 4);
        program.setUniform("point_light_intensity", pointLightsIntensity, 1);
    }
}
