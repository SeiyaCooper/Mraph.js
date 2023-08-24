export default class WebglRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");

        const gl = this.gl;
        this.usage = gl.STATIC_DRAW;
        // gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    render(mesh, program) {
        const gl = this.gl;

        for (let [name, value] of Object.entries(mesh.attributes ?? {})) {
            if (!value.buffer) {
                value.buffer = gl.createBuffer();
                value.needsUpdate = true;
            }

            const buffer = value.buffer;
            const location = program.locations.get(name);
            const n = program.attributes[name];

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            if (value.needsUpdate ?? true) {
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array(value.data),
                    this.usage
                );
                value.needsUpdate = false;
            }

            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, n, gl.FLOAT, false, 0, 0);
        }

        for (let [name, data] of Object.entries(mesh.uniforms ?? {})) {
            program.setUniform(name, data);
        }

        const indices = mesh.indices;
        if (typeof indices !== "number") {
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices.data),
                this.usage
            );
            gl.drawElements(mesh.mode, indices.data.length, indices.type, 0);
        } else {
            gl.drawArrays(mesh.mode, 0, indices);
        }

        for (let child of mesh.children ?? []) {
            this.render(child, program);
        }
    }

    clear(r, g, b, a) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
