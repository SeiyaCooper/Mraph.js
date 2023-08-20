import Matrix from "../math/Matrix.js";

export default class Graph {
    indices = { data: [] };
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

        this.mode = gl.TRIANGLES;
        this.indices.type = gl.UNSIGNED_SHORT;
        for (let value of Object.values(this.attributes)) {
            const buffer = gl.createBuffer();
            value.buffer = buffer;
            value.needsUpdate = true;
        }
    }

    set gl(gl) {
        this._gl = gl;
        this.prepareToRender();
    }

    get gl() {
        return this._gl;
    }
}
