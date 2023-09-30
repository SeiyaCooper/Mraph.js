import Color from "../core/Color.js";
import Matrix from "../math/Matrix.js";

export default class Graph {
    indices = { data: [] };
    children = [];
    visible = true;
    _color = new Color(1, 1, 1);
    mode = "TRIANGLES";
    attributes = {
        position: { data: [] },
        color: { data: [] },
    };
    uniforms = {
        modelMat: Matrix.identity(4),
    };

    /**
     * get ready for rendering
     * set some properties after get gl context
     */
    prepareToRender() {
        const gl = this.gl;

        this.mode = gl[this.mode];

        if (typeof this.indices !== "number") {
            this.indices.type = gl.UNSIGNED_SHORT;
        }

        this.update?.();

        for (let value of Object.values(this.attributes)) {
            const buffer = gl.createBuffer();
            value.buffer = buffer;
            value.needsUpdate = true;
        }

        for (let child of this.children) {
            child.gl = this.gl;
        }
    }

    set gl(gl) {
        this._gl = gl;
        this.prepareToRender();
    }

    get gl() {
        return this._gl;
    }

    set color(color) {
        this._color = color;
        this.strokeColor = color;
        this.fillColor = color;
    }

    get color() {
        return this._color;
    }
}
