import GetColorComponent from "./components/GetColorComponent.js";
import * as COLORS from "../constants/colors.js";

export default class Material {
    _depthTest = true;
    colorMode = "single";
    color = COLORS.WHITE;
    vertexShader = "";
    fragmentShader = "";
    components = [];

    constructor() {
        this.attachComponent(new GetColorComponent());
    }

    attachComponent(component) {
        this.components.push(component);
    }

    compileComponents() {
        let code;
        for (let component of this.components) {
            code = component.compile(
                this.vertexShader,
                this.fragmentShader,
                this
            );
        }
        return code;
    }

    passComponentVariables() {
        for (let component of this.components) component.passVariables(this);
    }

    set depthTest(val) {
        this._depthTest = val;
    }

    get depthTest() {
        return this._depthTest;
    }
}
