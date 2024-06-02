import Matrix from "../../math/Matrix.js";
import * as GLENUM from "../../constants/glenum.js";
import ProgramManager from "./ProgramManager.js";

export default class WebGLRenderer {
    /**
     * HTML canvas eLement
     * @type {HTMLCanvasElement}
     */
    canvas = undefined;

    /**
     * @type {ProgramManager}
     */
    programManager = new ProgramManager();

    /**
     * rendering context
     * @type {WebGLRenderingContext | WebGL2RenderingContext}
     */
    gl = undefined;

    /**
     * usage of this renderer, default to be gl.STATIC_DRAW
     * @type {number}
     */
    usage = GLENUM.STATIC_DRAW;

    /**
     * whether to use depthTest, default to be true
     */
    _depthTest = false;

    /**
     * whether to use depthMask, default to be true
     */
    _depthMask = false;

    constructor(canvas, contextConfig = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2", contextConfig);
        if (!this.gl) this.gl = canvas.getContext("webgl", contextConfig);
        this.resize(canvas.width, canvas.height);
        this.depthTest = true;
        this.depthMask = true;
    }

    /**
     * Renders the scene
     * @param {Geometry} mesh
     * @param {Camera} camera
     * @param {Object} surroundings
     */
    render(mesh, camera, surroundings = {}) {
        const gl = this.gl;
        const scene = { mesh, camera, surroundings };
        const material = mesh.material;

        this.depthTest = material.depthTest;

        if (!material.program)
            this.programManager.setProgram(material, this.gl, scene);
        const program = material.program;

        material.beforeRender(scene);
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

        if (Array.isArray(indices)) {
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices),
                this.usage
            );
            gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mode, 0, indices);
        }

        for (let child of mesh.children ?? []) {
            this.render(child, camera, surroundings);
        }
    }

    /**
     * Clears the canvas with a certain colour
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     */
    clear(r, g, b, a) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Resize the canvas
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.gl.viewport(0, 0, width, height);
    }

    set depthTest(bool) {
        const gl = this.gl;

        if (bool === this._depthTest) return;

        if (bool) {
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }
    }

    get depthTest() {
        return this._depthTest;
    }

    set depthMask(bool) {
        if (bool === this._depthMask) return;
        this.gl.depthMask(bool);
    }

    get depthMask() {
        return this._depthMask;
    }
}
