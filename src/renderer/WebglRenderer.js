import Matrix from "../math/Matrix.js";

export default class WebglRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");

        const gl = this.gl;
        this.usage = gl.STATIC_DRAW;
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    render(mesh, program) {
        const gl = this.gl;

        for (let [name, data] of Object.entries(mesh.attributes)) {
            const buffer = program.buffers.get(name);
            const location = program.locations.get(name);
            const n = program.attributes[name];

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), this.usage);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, n, gl.FLOAT, false, 0, 0);
        }

        for (let [name, data] of Object.entries(mesh.uniforms)) {
            const location = program.locations.get(name);
            const n = program.uniforms[name];
            const arr = new Float32Array(data.flat());

            if (Matrix.isMatrix(data)) {
                gl["uniformMatrix" + n + "fv"](location, false, arr);
            } else {
                gl["uniform" + n + "fv"](location, arr);
            }
        }

        const indices = mesh.indices;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices.data),
            this.usage
        );
        gl.drawElements(
            gl[mesh.mode],
            indices.data.length,
            gl[indices.type],
            0
        );
    }

    clear(color = [0, 0, 0, 1]) {
        const gl = this.gl;
        gl.clearColor(...color);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
