import { mergeObject } from "../../utils/utils.js";
import MraphError from "../../utils/MraphError.js";

export default class Program {
    /**
     * A set of variable locations
     * @type {Map}
     */
    locations = new Map();

    constructor(gl, { vs = "", fs = "" } = {}) {
        this.gl = gl;
        this.vs = createShader(gl, gl.VERTEX_SHADER, vs);
        this.fs = createShader(gl, gl.FRAGMENT_SHADER, fs);
        this.program = createProgram(gl, this.vs, this.fs);

        // TODO
        mergeObject(this, this.getExtension("OES_vertex_array_object"));
    }

    /**
     * Uses this program for rendering
     */
    use() {
        this.gl.useProgram(this.program);
    }

    /**
     * Sets a uniform variable
     * @param {string} name
     * @param {Matrix | Vector | number[]} data
     * @param {number} [n]
     */
    setUniform(name, data, n) {
        const gl = this.gl;

        // Get location
        let location;
        if (this.locations.has(name)) {
            location = this.locations.get(name);
        } else {
            location = gl.getUniformLocation(this.program, name);
            this.locations.set(name, location);
        }

        this.use();

        if (Array.isArray(data[0])) {
            const arr = new Float32Array(data.flat());
            gl["uniformMatrix" + (n ?? data[0].length) + "fv"](
                location,
                false,
                arr
            );
        } else if (Array.isArray(data)) {
            const arr = new Float32Array(data);
            gl["uniform" + (n ?? data.length) + "fv"](location, arr);
        } else {
            gl.uniform1f(location, data);
        }
    }

    /**
     * Sets attribute variable
     * @param {string} name
     * @param {object} value
     * @param {number} n
     * @param {number} usage
     * @returns
     */
    setAttriBuffer(name, value, n, usage) {
        const gl = this.gl;

        let location;
        if (this.locations.has(name)) {
            location = this.locations.get(name);
        } else {
            location = gl.getAttribLocation(this.program, name);
            this.locations.set(name, location);
        }

        if (!value.buffer) {
            value.buffer = gl.createBuffer();
            value.needsUpdate = true;
        }
        const buffer = value.buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        if (value.needsUpdate ?? true) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.data), usage);
            value.needsUpdate = false;
        }

        // Can not find this variable, then do nothing
        if (location === -1) return;

        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, n, gl.FLOAT, false, 0, 0);
    }

    getExtension(name) {
        const ext = this.gl.getExtension(name);
        return ext;
    }
}

// utils
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderInfoLog(shader) !== "") {
        MraphError.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    if (gl.getProgramInfoLog(program) !== "") {
        MraphError.warn(gl.getProgramInfoLog(program));
    }

    return program;
}
