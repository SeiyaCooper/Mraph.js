import Matrix from "../../math/Matrix.js";
import * as GLENUM from "../../constants/glenum.js";
import ProgramManager from "./ProgramManager.js";
import MraphError from "../../utils/MraphError.js";
import Mobject2D from "../../mobjects/2D/Mobject2D.js";

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
     * A set of vaos
     * @type {WebGLVertexArrayObject[]}
     */
    VAOs = new Map();

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
        if (!this.gl) {
            this.gl = canvas.getContext("webgl", contextConfig);
            this.EXT_VAO = this._getExtension("OES_vertex_array_object");
        }

        this.resize(canvas.width, canvas.height);
        this.depthTest = true;
        this.depthMask = true;
        this.alphaTest = false;
    }

    /**
     * Renders the scene
     * @param {Geometry} mesh
     * @param {Camera} camera
     * @param {Object} surroundings
     */
    render(mesh, camera, surroundings = {}) {
        const renderList = this.sort(mesh);

        for (let mesh of renderList) {
            this.renderSingle(mesh, camera, surroundings);
        }
    }

    /**
     * Renders a single mesh.
     * @param {Geometry} mesh
     * @param {Camera} camera
     * @param {Object} surroundings
     */
    renderSingle(mesh, camera, surroundings = {}) {
        const gl = this.gl;
        const scene = { mesh, camera, surroundings };
        const material = mesh.material;

        this.depthTest = material.depthTest;
        this.depthMask = material.depthMask;

        if (!material.program) this.programManager.setProgram(material, this.gl, scene);
        const program = material.program;
        program.use();

        material.passVariables(scene);
        program.setUniform("viewMat", camera.viewMat);
        program.setUniform("projectionMat", camera.projectionMat);
        program.setUniform("modelMat", mesh.matrix ?? Matrix.identity(4));

        if (this.VAOs.has(mesh)) {
            this._bindVAO(this.VAOs.get(mesh));
        } else {
            const VAO = this._createVAO();
            this.VAOs.set(mesh, VAO);
            this._bindVAO(VAO);
        }

        for (let [name, value] of mesh.attributes) {
            if (!value.glBuffer) {
                value.glBuffer = gl.createBuffer();
                value.needsUpdate = true;
                program.linkAttribute(name, value);
            }

            if (!value.needsUpdate) continue;

            gl.bindBuffer(gl.ARRAY_BUFFER, value.glBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.data), this.usage);
            value.needsUpdate = false;
        }
        for (let [name, data] of mesh.uniforms) {
            program.setUniform(name, data.data, data.size);
        }

        const indices = mesh.indices;
        const mode = GLENUM[mesh.mode] ?? GLENUM.TRIANGLES;

        if (Array.isArray(indices.data)) {
            if (!indices.buffer) {
                const buffer = gl.createBuffer();
                indices.buffer = buffer;
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);

            if (indices.needsUpdate) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices.data), this.usage);
                indices.needsUpdate = false;
            }

            gl.drawElements(mode, indices.data.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mode, 0, indices.data);
        }
    }

    /**
     * Returns a list of visible meshes.
     * @param {Node} scene
     */
    sort(scene) {
        const list2D = [];
        const list3D = [];

        scene.traverse((node) => {
            if (!node.visible) return;

            if (!node.material) {
                MraphError.error("Each geometry should have a material.");
                return;
            }

            if (node.needsUpdate) {
                node.update?.();
                node.needsUpdate = false;
            }

            if (node.needsUpdateMatrix) {
                node.updateMatrix?.();
                node.needsUpdateMatrix = false;
            }

            if (Mobject2D.isInstance(node)) {
                list2D.push(node);
            } else {
                list3D.push(node);
            }
        });

        list2D.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });

        return list3D.concat(list2D);
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

    /**
     * Private method, creates a vertex array object
     * @returns {WebGLVertexArrayObject}
     */
    _createVAO() {
        if (this.EXT_VAO) {
            return this.EXT_VAO.createVertexArrayOES();
        } else {
            return this.gl.createVertexArray();
        }
    }

    /**
     * Private method, binds a vertex array object
     * @returns {WebGLVertexArrayObject}
     */
    _bindVAO(VAO) {
        if (this.EXT_VAO) {
            this.EXT_VAO.bindVertexArrayOES(VAO);
        } else {
            this.gl.bindVertexArray(VAO);
        }
    }

    /**
     * Private method, gets a webgl extension
     * @returns {WebGLVertexArrayObject}
     */
    _getExtension(name) {
        const ext = this.gl.getExtension(name);
        return ext;
    }

    set depthTest(bool) {
        const gl = this.gl;

        if (!!bool === this._depthTest) return;

        if (bool) {
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }

        this._depthTest = bool;
    }

    get depthTest() {
        return this._depthTest;
    }

    set depthMask(bool) {
        if (!!bool === this._depthMask) return;
        this.gl.depthMask(bool);
        this._depthMask = bool;
    }

    get depthMask() {
        return this._depthMask;
    }
}
