export default class Program {
    locations = new Map();
    buffers = new Map();

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
    }

    set attributes(val) {
        this._attributes = val;
        for (let [name] of Object.entries(val)) {
            this.locations.set(
                name,
                this.gl.getAttribLocation(this.program, name)
            );
            this.buffers.set(name, this.gl.createBuffer());
        }
    }

    get attributes() {
        return this._attributes;
    }

    set uniforms(val) {
        this._uniforms = val;

        const gl = this.gl;
        const program = this.program;
        for (let [name, data] of Object.entries(val)) {
            const location = gl.getUniformLocation(program, name);

            if (Array.isArray(data[0])) {
                const n = data[0].length;
                const arr = new Float32Array(data.flat());
                gl["uniformMatrix" + n + "fv"](location, false, arr);
            } else {
                const arr = new Float32Array(data.data);
                gl["uniform" + data.n + "fv"](location, arr);
            }
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
