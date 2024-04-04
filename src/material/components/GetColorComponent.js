import * as SlotParser from "../SlotParser.js";

const vsVertex = `
attribute vec4 color;
varying vec4 v_color;
`;
const vsMainVertex = `v_color = color;`;
const fsVertex = `varying vec4 v_color;`;
const fsMainVertex = `vec4 color = v_color;`;

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
            default:
                console.log(`Invalid color mode: ${colorMode}`);
        }

        return { vs, fs };
    }

    passVariables(target) {
        if (target.colorMode === "single")
            target.program.setUniform("color", target.color);
    }
}
