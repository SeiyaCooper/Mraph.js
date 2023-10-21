import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

let startedTouches = [];

export default class Control {
    center = new Vector(0, 0, 0);
    _element = document;
    rotateSpeed = 0.0001;

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

    handleTouchStart(e) {
        e.preventDefault();

        startedTouches = [];
        for (let touch of e.touches) {
            startedTouches.push(copyTouch(touch));
        }
    }

    handleTouchMove(e) {
        if (e.touches.length > 1) {
            this.zoom(1);
        } else {
            const touch = copyTouch(e.touches[0]);
            const xRotationAngle =
                this.rotateSpeed * (touch.y - startedTouches[0].y);
            const yRotationAngle =
                this.rotateSpeed * (touch.x - startedTouches[0].x);
            console.log(xRotationAngle);
            this.rotate(xRotationAngle, yRotationAngle, 0);
        }
    }

    set element(el) {
        this._element = el;
        el.addEventListener("touchstart", (e) => {
            this.handleTouchStart(e);
        });
        el.addEventListener("touchmove", (e) => {
            this.handleTouchMove(e);
        });
    }
    get element() {
        return this._element;
    }
}

function copyTouch(touch) {
    return {
        id: touch.identifier,
        x: touch.pageX,
        y: touch.pageY,
    };
}
