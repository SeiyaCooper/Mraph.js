import Mobject from "./Mobject.js";
import Plane from "../geometry/Plane.js";
import Texture from "../core/Texture.js";

export default class ImageMobject extends Mobject {
    _image = undefined;

    texture = undefined;

    constructor(image, { width = 1, height = 1, maintainAspectRatio = true } = {}) {
        super();
        this._image = image;
        this.material.colorMode = "texture";

        this.width = width;
        this.height = height;
        this.maintainAspectRatio = maintainAspectRatio;
    }

    update() {
        let plane;

        if (this.maintainAspectRatio) {
            let ratio = this.image.height / this.image.width;
            plane = new Plane({ width: this.width, height: ratio * this.width });
        } else {
            plane = new Plane({ width: this.width, height: this.height });
        }
        plane.update();

        this.mergeAttributes(plane, "position", "normal", "uv");
        this.setIndex(6);
    }

    set image(image) {
        if (typeof image === "string") {
            const img = new Image();
            const tex = new Texture(this.layer.renderer.gl);

            img.src = image;
            img.onload = () => {
                tex.image = img;
                tex.upload();
            };

            this._image = img;
            this.texture = tex;
        } else {
            this._image = image;
            this.texture = new Texture(this.layer.renderer.gl, {
                image,
            });
        }
        this.material.diffuseTexture = this.texture;
    }

    get image() {
        return this._image;
    }

    set layer(layer) {
        this._layer = layer;
        this.image = this._image;
    }

    get layer() {
        return this._layer;
    }
}
