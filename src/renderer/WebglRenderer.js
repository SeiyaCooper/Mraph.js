export default class WebglRenderer {
    constructor(canvas) {
        this.canvas = canvas;
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

        gl.useProgram(this.program);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    render(mesh, camera) {
        const gl = this.gl;
        const program = this.program;

        passAttrBufferData(gl, program, "position", mesh.vertexes, 4);
        passAttrBufferData(gl, program, "color", mesh.colors, 4);
        passUnifMat4(gl, program, "modelMat", mesh.matrix.flat());

        const location = gl.getUniformLocation(program, "projectionMat");
        gl.uniformMatrix4fv(location, false, camera.matrix.flat());

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices),
            gl.STATIC_DRAW
        );

        gl.drawElements(
            gl[mesh.mode],
            mesh.indices.length,
            gl.UNSIGNED_SHORT,
            0
        );
    }

    clear() {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

const VERTEX_CODE = `
    attribute vec4 position;
    attribute vec4 color;

    uniform mat4 modelMat;
    uniform mat4 projectionMat;

    varying vec4 vColor;

    void main() {
        gl_Position = projectionMat * modelMat * position;
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
}

function passUnifMat4(gl, program, name, data) {
    const location = gl.getUniformLocation(program, name);
    gl.uniformMatrix4fv(location, false, new Float32Array(data));
}
