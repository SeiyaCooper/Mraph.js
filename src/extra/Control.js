import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

export default class Control {
    center = new Vector(0, 0, 0);
    _element = document;

    constructor(camera, { element = document } = {}) {
        this.camera = camera;
        this.element = element;
    }

    rotate(xRotationAngle, yRotationAngle, zRotationAngle) {
        const camera = this.camera;
        const center = this.center;

        camera.position.copy(
            camera.position
                .reduce(center)
                .trans(Matrix.rotateX(xRotationAngle, 3))
                .trans(Matrix.rotateY(yRotationAngle, 3))
                .trans(Matrix.rotateZ(zRotationAngle, 3))
                .add(center)
        );
        camera.lookAt(center);
    }

    zoom(scale) {
        const camera = this.camera;
        const center = this.center;

        camera.position.copy(
            camera.position.reduce(center).mult(scale).add(center)
        );
    }

    handleTouchStart() {}

    set element(el) {
        this._element = el;
        el.addEventListener("touchstart", this.handleTouchStart);
    }
    get element() {
        return this._element;
    }
}
