import Mobject from "./Mobject.js";
import Plane from "../geometry/Plane.js";
import Texture from "../core/Texture.js";

export default class ImageMobject extends Mobject {
    _image = undefined;

    texture = undefined;

    /**
     * False by defalut, a image mobject should be updated only if the image is ready.
     */
    needsUpdate = false;

    constructor(image, { width = 1, height = 1, maintainAspectRatio = true } = {}) {
        super();
        this.image = image;
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
            Texture.loadFile(image, (texture) => {
                this.image = texture.image;
            });
        } else {
            this._image = image;
            this.texture = new Texture({ image });
            this.material.diffuseTexture = this.texture;
            this.needsUpdate = true;
        }
    }

    get image() {
        return this._image;
    }
}
