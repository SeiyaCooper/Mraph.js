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
            gl["uniformMatrix" + (n ?? data[0].length) + "fv"](location, false, arr);
        } else if (Array.isArray(data)) {
            const arr = new Float32Array(data);
            gl["uniform" + (n ?? data.length) + "fv"](location, arr);
        } else {
            gl.uniform1f(location, data);
        }
    }

    /**
     * Initiates a vertex array object
     * @param {Geometry} mesh
     */
    initVAO(mesh) {
        const gl = this.gl;

        for (let [name, value] of mesh.attributes) {
            const location = gl.getAttribLocation(this.program, name);

            // Can not find this variable, then do nothing
            if (location === -1) continue;

            const buffer = value.glBuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, value.size, gl.FLOAT, false, 0, 0);
        }
    }

    /**
     * Sets up a texture
     * @param {Texture} texture
     */
    setUpTexture(texture) {
        const gl = this.gl;
        const glTexture = gl.createTexture();
        texture.texture = glTexture;
    }

    /**
     * Binds a texture
     * @param {Texure} texture
     */
    bindTexture(texture) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + texture.unit);
        gl.bindTexture(texture.target, texture.texture);
    }

    /**
     * Uploads a texture to GPU
     * @param {Texture} texture
     */
    uploadTexture(texture) {
        const gl = this.gl;

        if (texture.flipY) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(texture.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.generateMipmap(texture.target);
    }

    /**
     * Updates parameters of a texture
     * @param {Texture} texture
     */
    updateTextureParams(texture) {
        const gl = this.gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.magFilter);
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
