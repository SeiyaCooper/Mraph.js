export default class Texture {
    constructor(
        gl,
        {
            image,
            target = gl.TEXTURE_2D,
            flipY = true,
            minFilter = gl.LINEAR,
            magFilter = gl.LINEAR,
        } = {}
    ) {
        this.gl = gl;
        this.image = image;
        this.target = target;
        this.flipY = flipY;
        this.texture = gl.createTexture();

        gl.bindTexture(this.target, this.texture);
        this.minFilter = minFilter;
        this.magFilter = magFilter;
    }

    upload() {
        const gl = this.gl;

        if (this.flipY) {
            gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        gl.bindTexture(this.target, this.texture);
        gl.texImage2D(
            this.target,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.image
        );
        gl.generateMipmap(this.target);
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
