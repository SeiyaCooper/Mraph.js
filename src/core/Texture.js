import * as GLENUM from "../constants/glenum.js";

export default class Texture {
    _dirty = false;

    _needsUpload = false;

    constructor({
        image,
        target = GLENUM.TEXTURE_2D,
        flipY = true,
        minFilter = GLENUM.LINEAR,
        magFilter = GLENUM.LINEAR,
        unit = 0,
    } = {}) {
        this.image = image;
        this.target = target;
        this.flipY = flipY;
        this.unit = unit;
        this.minFilter = minFilter;
        this.magFilter = magFilter;

        if (this.isImgReady) {
            this._needsUpload = true;
        }
    }

    get isImageReady() {
        return Boolean(this.image);
    }

    set minFilter(val) {
        this._minFilter = val;
        this._dirty = true;
    }
    get minFilter() {
        return this._minFilter;
    }

    set magFilter(val) {
        this._magFilter = val;
        this._dirty = true;
    }
    get magFilter() {
        return this._magFilter;
    }

    set image(val) {
        this._image = val;
        this.texture = null;
        this._needsUpload = true;
    }
    get image() {
        return this._image;
    }

    static loadFile(src, callback = () => {}) {
        const texture = new Texture();

        const img = new Image();
        img.src = src;
        img.onload = () => {
            texture.image = img;
            callback(texture);
        };

        return texture;
    }
}
