export default class Program {
    locations = new Map();
    buffers = new Map();

    constructor({ gl, vs = "", fs = "", attributes = {}, uniforms = {} } = {}) {
        this.gl = gl;
        this.vs = createShader(gl, gl.VERTEX_SHADER, vs);
        this.fs = createShader(gl, gl.FRAGMENT_SHADER, fs);
        this.program = createProgram(gl, this.vs, this.fs);
        this.attributes = attributes;
        this.uniforms = uniforms;
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
        for (let [name] of Object.entries(val)) {
            this.locations.set(
                name,
                this.gl.getUniformLocation(this.program, name)
            );
        }
    }

    get uniforms() {
        return this._uniforms;
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
