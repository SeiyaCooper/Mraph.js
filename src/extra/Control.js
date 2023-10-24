import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

let startedTouches = [];

export default class Control {
    center = new Vector(0, 0, 0);
    _element = document;

    enableZoom = true;
    radius = 10;
    scale = 1;

    enableRotate = true;
    theta = 0;
    phi = 0;
    startTheta = 0;
    startPhi = 0;
    targetTheta = 0;
    targetPhi = 0;
    deltaAngleMax = 0.1;
    rotateSpeed = 0.01;
    rotateEase = 0.1;

    constructor(camera, { element = document } = {}) {
        this.camera = camera;
        this.element = element;
        this.radius = camera.position.norm;
    }

    update() {
        const deltaPhi = Math.min(
            this.deltaAngleMax,
            (this.targetPhi - this.phi) * this.rotateEase,
        );
        const deltaTheta = Math.min(
            this.deltaAngleMax,
            (this.targetTheta - this.theta) * this.rotateEase,
        );
        this.phi += deltaPhi;
        this.theta += deltaTheta;

        this.camera.position.copy(
            new Vector(0, 0, this.radius * this.scale)
                .trans(Matrix.rotateX(this.phi, 3))
                .trans(Matrix.rotateY(-this.theta, 3)),
        );
        this.camera.lookAt(this.center);
    }

    handleTouchStart(e) {
        e.preventDefault();

        startedTouches = [];
        for (let touch of e.touches) {
            startedTouches.push(copyTouch(touch));
        }
        this.startPhi = this.phi;
        this.startTheta = this.theta;
    }

    handleTouchMove(e) {
        if (this.enableZoom && e.touches.length > 1) {
            const touch0 = copyTouch(e.touches[0]);
            const touch1 = copyTouch(e.touches[1]);
            const touchStart0 = findTouchById(touch0.id, startedTouches);
            const touchStart1 = findTouchById(touch1.id, startedTouches);

            this.scale =
                getLenByTwoTouches(touchStart0, touchStart1) /
                getLenByTwoTouches(touch0, touch1);
        } else if (this.enableRotate) {
            const touch = copyTouch(e.touches[0]);
            const touchStart = findTouchById(touch.id, startedTouches);
            const deltaY = touch.y - touchStart.y;
            const deltaX = touch.x - touchStart.x;

            this.targetPhi = this.startPhi + this.rotateSpeed * deltaY;
            this.targetTheta = this.startTheta + this.rotateSpeed * deltaX;
        }
    }

    handleTouchEnd(e) {
        if (e.touches.length > 0) this.handleTouchStart(e);

        this.radius *= this.scale;
        this.scale = 1;
    }

    set element(el) {
        this._element = el;
        el.addEventListener("touchstart", (e) => {
            this.handleTouchStart(e);
        });
        el.addEventListener("touchmove", (e) => {
            this.handleTouchMove(e);
        });
        el.addEventListener("touchend", (e) => {
            this.handleTouchEnd(e);
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

function findTouchById(id, array) {
    let touch;
    for (touch of array) {
        if ((touch.id = id)) break;
    }
    return touch;
}

function getLenByTwoTouches(touch0, touch1) {
    return Math.sqrt((touch0.x - touch1.x) ** 2 + (touch0.y - touch1.y) ** 2);
}
