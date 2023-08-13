import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

export default class WebglRenderer {
    vertexNum = 0;
    mode = undefined;

    constructor(canvas) {
        this.canvas = canvas;
        this.matrix = Matrix.identity(4);
    }

    clear() {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    style(el) {
        this.styleSet = el;
    }

    render() {
        this.gl.drawArrays(this.mode, 0, this.vertexNum);
    }

    line(start, end) {
        this.vertexNum = 4;

        start = new Vector(start);
        end = new Vector(end);
        const direcVec = end.reduce(start);
        const vec = direcVec.mult(
            this.styleSet.strokeWidth / 2 / direcVec.length
        );

        const rotate90 = Matrix.rotateZ(Math.PI / 2);
        const rotateNeg90 = Matrix.rotateZ(-Math.PI / 2);
        const position = [
            start.add(vec.trans(rotate90)).columns,
            start.add(vec.trans(rotateNeg90)).columns,
            end.add(vec.trans(rotateNeg90)).columns,
            end.add(vec.trans(rotate90)).columns,
        ];

        passAttrBufferData(
            this.gl,
            this.program,
            "a_position",
            position.flat(),
            4
        );
        this.mode = this.gl.TRIANGLE_FAN;
    }

    set canvas(canvas) {
        this._canvas = canvas;

        const gl = canvas.getContext("webgl");
        this.gl = gl;
        [this.vertexShader, this.fragmentShader, this.program] = initProgram(
            gl,
            VERTEX_CODE,
            FRAGMENT_CODE
        );
    }

    get canvas() {
        return this._canvas;
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
        gl_Position = (a_position / vec4(u_resolution, 1.0)) * u_matrix;
    }
`;

const FRAGMENT_CODE = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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

function initProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    console.log(gl.getShaderInfoLog(fragmentShader));
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    return [vertexShader, fragmentShader, program];
}

function passAttrBufferData(gl, program, name, data, num) {
    const location = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
}
