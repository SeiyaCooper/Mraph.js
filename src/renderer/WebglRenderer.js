import { mergeObject } from "../utils/utils.js";
import Matrix from "../math/Matrix.js";

export default class WebglRenderer {
    _vertexes = [];
    path = [];
    mode = undefined;
    styleSet = { strokeWidth: 5 };

    constructor(canvas) {
        this.canvas = canvas;
        this.matrix = Matrix.identity(4);
    }

    begin() {
        this.path = [];
    }

    close() {}

    fill() {}

    stroke() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexes.length);
        this.vertexes = [];
    }

    clear() {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    style(el) {
        mergeObject(this.styleSet, el);
    }

    move(pos) {
        this.path.push(pos);
    }

    line3D(pos) {
        if (!this.path.length) this.move(pos);

        const path = this.path;
        const start = path[path.length - 1];
        const end = pos;
        const vec = end.reduce(start);
        path.push(pos);
        vec.length = this.styleSet.strokeWidth / 2;

        const rotate90 = Matrix.rotateZ(Math.PI / 2);
        const rotateNeg90 = Matrix.rotateZ(-Math.PI / 2);
        const positon = [
            start.add(vec.trans(rotate90)).columns,
            start.add(vec.trans(rotateNeg90)).columns,
            end.add(vec.trans(rotateNeg90)).columns,
            end.add(vec.trans(rotateNeg90)).columns,
            end.add(vec.trans(rotate90)).columns,
            start.add(vec.trans(rotate90)).columns,
        ];

        if (this._vertexes.length) {
            this.vertexes = this._vertexes.concat(positon);
        } else {
            this.vertexes = positon;
        }
    }

    arc2D() {}

    set canvas(canvas) {
        this._canvas = canvas;

        const gl = canvas.getContext("webgl");
        this.gl = gl;
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
        gl.useProgram(this.program);

        const res_location = gl.getUniformLocation(
            this.program,
            "u_resolution"
        );
        gl.uniform3f(
            res_location,
            gl.canvas.width / 2,
            gl.canvas.height / 2,
            500
        );
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    get canvas() {
        return this._canvas;
    }

    set vertexes(arr) {
        this._vertexes = arr;
        passAttrBufferData(this.gl, this.program, "a_position", arr.flat(), 4);
    }

    get vertexes() {
        return this._vertexes;
    }

    set matrix(mat) {
        this._matrix = mat;

        const gl = this.gl;
        const location = gl.getUniformLocation(this.program, "u_matrix");
        gl.uniformMatrix4fv(
            location,
            false,
            new Float32Array(mat.columns.flat())
        );
    }

    get matrix() {
        return this._matrix;
    }
}

const VERTEX_CODE = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;
    uniform vec3 u_resolution;

    void main() {
        gl_Position = (a_position  * u_matrix) / vec4(u_resolution, 1.0);
    }
`;

const FRAGMENT_CODE = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
}
