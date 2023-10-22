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
    deltaTheta = 0;
    deltaPhi = 0;
    rotateSpeed = 0.01;

    constructor(camera, { element = document } = {}) {
        this.camera = camera;
        this.element = element;
        this.radius = camera.position.norm;
    }

    update() {
        this.camera.position.copy(
            new Vector(0, 0, this.radius * this.scale)
                .trans(Matrix.rotateX(this.phi + this.deltaPhi, 3))
                .trans(Matrix.rotateY(-this.theta - this.deltaTheta, 3)),
        );
        this.camera.lookAt(this.center);
    }

    handleTouchStart(e) {
        e.preventDefault();

        startedTouches = [];
        for (let touch of e.touches) {
            startedTouches.push(copyTouch(touch));
        }
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

            this.deltaPhi = this.rotateSpeed * (touch.y - touchStart.y);
            this.deltaTheta = this.rotateSpeed * (touch.x - touchStart.x);
        }
        this.update();
    }

    handleTouchEnd(e) {
        if (e.touches.length > 0) this.handleTouchStart(e);

        this.radius *= this.scale;
        this.scale = 1;

        this.theta += this.deltaTheta;
        this.phi += this.deltaPhi;
        this.deltaPhi = this.deltaTheta = 0;
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
