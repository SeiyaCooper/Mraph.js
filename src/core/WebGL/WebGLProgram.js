import { mergeObject } from "../../utils/utils.js";

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

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform(name, data) {
        const gl = this.gl;
        const location = this.gl.getUniformLocation(this.program, name);

        this.use();

        if (Array.isArray(data[0])) {
            const n = data[0].length;
            const arr = new Float32Array(data.flat());
            gl["uniformMatrix" + n + "fv"](location, false, arr);
        } else if (Array.isArray(data)) {
            const arr = new Float32Array(data);
            gl["uniform" + data.length + "fv"](location, arr);
        } else {
            gl.uniform1f(location, data);
        }
    }

    setAttriBuffer(name, value, n, usage) {
        const gl = this.gl;
        let location;

        if (!value.buffer) {
            value.buffer = gl.createBuffer();
            value.needsUpdate = true;
        }
        const buffer = value.buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        if (this.locations.has(name)) {
            location = this.locations.get(name);
        } else {
            location = gl.getAttribLocation(this.program, name);
        }

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
