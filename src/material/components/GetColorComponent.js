import * as SlotParser from "../SlotParser.js";
import MraphError from "../../utils/MraphError.js";

const vsVertex = `
attribute vec4 color;
varying vec4 v_color;
`;
const vsMainVertex = `v_color = color;`;
const fsVertex = `varying vec4 v_color;`;
const fsMainVertex = `vec4 color = v_color;`;

const vsTexture = `
attribute vec2 uv;
varying vec2 v_uv;
`;
const vsMainTexture = `v_uv = uv;`;
const fsTexture = `
varying vec2 v_uv;
uniform sampler2D sampler;
`;
const fsMainTexture = `vec4 color = texture2D(sampler, v_uv);`;

export default class GetColorComponent {
    compile(vs, fs, { colorMode }) {
        switch (colorMode) {
            case "single":
                vs = SlotParser.replace(vs, "get_color", "");
                vs = SlotParser.replace(vs, "get_color::main", "");
                fs = SlotParser.replace(fs, "get_color", `uniform vec4 color;`);
                fs = SlotParser.replace(fs, "get_color::main", "");
                break;
            case "vertex":
                vs = SlotParser.replace(vs, "get_color", vsVertex);
                vs = SlotParser.replace(vs, "get_color::main", vsMainVertex);
                fs = SlotParser.replace(fs, "get_color", fsVertex);
                fs = SlotParser.replace(fs, "get_color::main", fsMainVertex);
                break;
            case "texture":
                vs = SlotParser.replace(vs, "get_color", vsTexture);
                vs = SlotParser.replace(vs, "get_color::main", vsMainTexture);
                fs = SlotParser.replace(fs, "get_color", fsTexture);
                fs = SlotParser.replace(fs, "get_color::main", fsMainTexture);
                break;
            default:
                MraphError.error(`Invalid color mode: ${colorMode}`);
        }

        return { vs, fs };
    }

    passVariables(target) {
        if (target.colorMode === "single") {
            target.program.setUniform("color", target.color);
            return;
        }

        if (target.colorMode === "texture") {
            const map = target.diffuseTexture;

            if (!map) return;
            map.bind();

            return;
        }
    }
}
