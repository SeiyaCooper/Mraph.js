import Matrix from "../../math/Matrix.js";
import * as GLENUM from "../../constants/glenum.js";
import ProgramManager from "./ProgramManager.js";

export default class WebGLRenderer {
    constructor(canvas, contextConfig = {}) {
        this.canvas = canvas;
        this.programManager = new ProgramManager();

        this.gl = canvas.getContext("webgl2", contextConfig);
        if (!this.gl) this.gl = canvas.getContext("webgl", contextConfig);

        const gl = this.gl;
        this.usage = gl.STATIC_DRAW;
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    render(mesh, camera, material, surroundings) {
        const gl = this.gl;
        const scene = { mesh, camera, surroundings };

        if (!material.depthTest) gl.disable(gl.DEPTH_TEST);

        if (!material.program)
            this.programManager.setProgram(material, this.gl, scene);
        const program = material.program;

        material.beforeRender?.(scene);
        program.setUniform("viewMat", camera.viewMat);
        program.setUniform("projectionMat", camera.projectionMat);
        program.setUniform("modelMat", mesh.matrix ?? Matrix.identity(4));

        for (let [name, value] of Object.entries(mesh.attributes ?? {})) {
            const n = value.n ?? program.attributes[name];
            program.setAttriBuffer(name, value, n, this.usage);
        }

        for (let [name, data] of Object.entries(mesh.uniforms ?? {})) {
            program.setUniform(name, data);
        }

        const indices = mesh.indices;
        const mode = mesh.glMode ?? GLENUM.TRIANGLES;

        if (typeof indices !== "number") {
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices.data),
                this.usage
            );

            const type = indices.webglType ?? gl.UNSIGNED_SHORT;

            gl.drawElements(mode, indices.data.length, type, 0);
        } else {
            gl.drawArrays(mode, 0, indices);
        }

        for (let child of mesh.children ?? []) {
            this.render(
                child,
                camera,
                child.material ?? material,
                surroundings
            );
        }

        if (!material.depthTest) gl.enable(gl.DEPTH_TEST);
    }

    clear(r, g, b, a) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    resize(width, height) {
        this.gl.viewport(0, 0, width, height);
    }
}
