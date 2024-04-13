import WebGLProgram from "../core/WebGL/WebGLProgram.js";
import Material from "./Material.js";
import * as SlotParser from "./SlotParser.js";

import vertexShader from "./shader/lambert.vert?raw";
import fragmentShader from "./shader/lambert.frag?raw";

export default class LambertMaterial extends Material {
    constructor() {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    initProgram(gl, { surroundings }) {
        let { vs, fs } = super.compileComponents();
        fs = SlotParser.replace(
            fs,
            "point_light_num",
            surroundings.pointLights.length
        );
        fs = SlotParser.replace(
            fs,
            "directional_light_num",
            surroundings.directionalLights.length
        );
        console.log(fs);
        this.program = new WebGLProgram(gl, { vs, fs });
    }

    beforeRender({ surroundings }) {
        const program = this.program;

        const pointLights = surroundings.pointLights;
        if (pointLights.length > 0) {
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
            program.setUniform(
                "point_light_intensity",
                pointLightsIntensity,
                1
            );
        }

        const directionalLights = surroundings.directionalLights;
        if (directionalLights.length > 0) {
            const directionalLightsDirection = [];
            const directionalLightsColor = [];
            const directionalLightsIntensity = [];
            for (let light of directionalLights) {
                directionalLightsDirection.push(...light.direction);
                directionalLightsColor.push(...light.color);
                directionalLightsIntensity.push(light.intensity);
            }
            program.setUniform(
                "directional_light_direction",
                directionalLightsDirection,
                3
            );
            program.setUniform(
                "directional_light_color",
                directionalLightsColor,
                4
            );
            program.setUniform(
                "directional_light_intensity",
                directionalLightsIntensity,
                1
            );
        }

        this.passComponentVariables();
    }
}
