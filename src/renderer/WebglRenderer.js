import Matrix from "../math/Matrix.js";

export default class WebglRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.matrix = Matrix.identity(4);
    }

    render(mesh) {
        const gl = this.gl;
        const program = this.program;

        passAttrBufferData(gl, program, "position", mesh.vertexes, 4);
        passAttrBufferData(gl, program, "color", mesh.colors, 4);
        passUnifMat4(gl, program, "matrix", mesh.matrix.columns);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices.flat()),
            gl.STATIC_DRAW
        );

        gl.drawElements(
            gl.TRIANGLES,
            mesh.indices.flat().length,
            gl.UNSIGNED_SHORT,
            0
        );
    }

    set canvas(canvas) {
        this._canvas = canvas;
        this.gl = canvas.getContext("webgl");

        const gl = this.gl;
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_CODE);
        this.fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            FRAGMENT_CODE
        );
        this.program = createProgram(
            gl,
            this.vertexShader,
            this.fragmentShader
        );
        const location = gl.getUniformLocation(this.program, "resolution");
        gl.useProgram(this.program);
        gl.uniform2f(location, canvas.width, canvas.height);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    get canvas() {
        return this._canvas;
    }

    set matrix(mat) {
        this._matrix = mat;
        passUnifMat4(this.gl, this.program, "projectionMatrix", mat.columns);
    }
    get matrix() {
        return this._matrix;
    }
}

const VERTEX_CODE = `
    attribute vec4 position;
    attribute vec4 color;

    uniform mat4 matrix;
    uniform mat4 projectionMatrix;
    uniform vec2 resolution;

    varying vec4 vColor;

    void main() {
        gl_Position = projectionMatrix * matrix * (position / vec4(resolution, 1.0, 1.0));
        vColor = color;
    }
`;

const FRAGMENT_CODE = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
}

function passAttrBufferData(gl, program, name, data, num) {
    const location = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(data.flat()),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
}

function passUnifMat4(gl, program, name, data) {
    const location = gl.getUniformLocation(program, name);
    gl.uniformMatrix4fv(location, false, new Float32Array(data.flat()));
}
