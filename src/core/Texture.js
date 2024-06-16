export default class Texture {
    constructor(
        gl,
        { image, target = gl.TEXTURE_2D, flipY = true, minFilter = gl.LINEAR, magFilter = gl.LINEAR, unit = 0 } = {}
    ) {
        this.gl = gl;
        this.image = image;
        this.target = target;
        this.flipY = flipY;
        this.texture = gl.createTexture();
        this.unit = unit;

        this.bind();
        this.minFilter = minFilter;
        this.magFilter = magFilter;
    }

    bind() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + this.unit);
        gl.bindTexture(this.target, this.texture);
    }

    upload() {
        const gl = this.gl;

        if (this.flipY) {
            gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.generateMipmap(this.target);
    }

    get isImgReady() {
        return Boolean(this.image);
    }

    static loadFile(gl, src, callback = () => {}) {
        const texture = new Texture(gl);

        const img = new Image();
        img.src = src;
        img.onload = () => {
            texture.image = img;
            callback(texture);
            texture.upload();
        };

        return texture;
    }

    set minFilter(val) {
        const gl = this.gl;
        this.__minFilter = val;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, val);
    }
    get minFilter() {
        return this.__minFilter;
    }
    set magFilter(val) {
        const gl = this.gl;
        this.__magFilter = val;
        this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, val);
    }
    get magFilter() {
        return this.__magFilter;
    }
}
