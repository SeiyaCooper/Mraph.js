import { mergeObject } from "../utils/utils.js";

export default class Program {
    locations = new Map();

    constructor(
        gl,
        { vs = "", fs = "", attributes = {}, uniforms = {}, textures = [] } = {}
    ) {
        this.gl = gl;
        this.vs = createShader(gl, gl.VERTEX_SHADER, vs);
        this.fs = createShader(gl, gl.FRAGMENT_SHADER, fs);
        this.program = createProgram(gl, this.vs, this.fs);
        this.attributes = attributes;
        this.uniforms = uniforms;
        this.textures = textures;

        // TODO
        mergeObject(this, this.getExtension("OES_vertex_array_object"));
    }

    setUniform(name, data) {
        const gl = this.gl;
        const location = this.gl.getUniformLocation(this.program, name);

        this.gl.useProgram(this.program);

        if (Array.isArray(data[0])) {
            const n = data[0].length;
            const arr = new Float32Array(data.flat());
            gl["uniformMatrix" + n + "fv"](location, false, arr);
        } else if (Array.isArray(data.data[0])) {
            const n = data.n ?? data.data[0].length;
            const arr = new Float32Array(data.data.flat());
            gl["uniformMatrix" + n + "fv"](location, arr);
        } else {
            const arr = new Float32Array(data.data);
            gl["uniform" + data.n + "fv"](location, arr);
        }
    }

    getExtension(name) {
        const ext = this.gl.getExtension(name);
        return ext;
    }

    set attributes(val) {
        this._attributes = val;
        for (let name of Object.keys(val)) {
            this.locations.set(
                name,
                this.gl.getAttribLocation(this.program, name)
            );
        }
    }

    get attributes() {
        return this._attributes;
    }

    set uniforms(val) {
        this._uniforms = val;

        for (let [name, data] of Object.entries(val)) {
            this.setUniform(name, data);
        }
    }

    get uniforms() {
        return this._uniforms;
    }

    set textures(val) {
        this._textures = val;
        for (let texture of val) {
            texture.upload();
        }
    }

    get textures() {
        return this._textures;
    }
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderInfoLog(shader) !== "") {
        console.warn(gl.getShaderInfoLog(shader));
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
        console.warn(gl.getProgramInfoLog(program));
    }

    return program;
}
