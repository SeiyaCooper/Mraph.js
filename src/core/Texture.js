export default class Texture {
    constructor(gl, { image, target = gl.TEXTURE_2D, flipY = true } = {}) {
        this.gl = gl;
        this.image = image;
        this.target = target;
        this.flipY = flipY;
        this.texture = gl.createTexture();
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
            this.image,
        );
        gl.generateMipmap(this.target);
    }
}
