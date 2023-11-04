import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

let startedPos = [],
    startTheta = 0,
    startPhi = 0,
    targetTheta = 0,
    targetPhi = 0;
const STATE = { WAIT: 0, ROTATE: 1, ZOOM: 2 };
let state = STATE.WAIT;

export default class Control {
    center = new Vector(0, 0, 0);
    _element = document;

    enableZoom = true;
    radius = 10;
    scale = 1;
    zoomSpeed = 1.1;

    enableRotate = true;
    theta = 0;
    phi = 0;
    phiMax = Math.PI / 2;
    phiMin = -Math.PI / 2;
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
            (targetPhi - this.phi) * this.rotateEase
        );
        const deltaTheta = Math.min(
            this.deltaAngleMax,
            (targetTheta - this.theta) * this.rotateEase
        );
        this.phi = Math.max(
            Math.min(this.phiMax, this.phi + deltaPhi),
            this.phiMin
        );
        this.theta += deltaTheta;

        this.camera.position.copy(
            new Vector(0, 0, this.radius * this.scale)
                .trans(Matrix.rotateX(this.phi, 3))
                .trans(Matrix.rotateY(-this.theta, 3))
        );
        this.camera.lookAt(this.center);
    }

    handleRotate(pos, startPos) {
        const deltaY = pos.y - startPos.y;
        const deltaX = pos.x - startPos.x;

        targetPhi = startPhi + this.rotateSpeed * deltaY;
        targetTheta = startTheta + this.rotateSpeed * deltaX;
    }

    handleZoom(scale) {
        this.scale = scale;
    }

    handleTouchStart(e) {
        e.preventDefault();

        startedPos = [];
        for (let touch of e.touches) {
            startedPos.push(getPos(touch));
        }
        startPhi = this.phi;
        startTheta = this.theta;
    }

    handleTouchMove(e) {
        if (this.enableZoom && e.touches.length > 1) {
            const touch0 = getPos(e.touches[0]);
            const touch1 = getPos(e.touches[1]);
            const touchStart0 = findPosById(touch0.id, startedPos);
            const touchStart1 = findPosById(touch1.id, startedPos);

            this.handleZoom(
                getLen(touchStart0, touchStart1) / getLen(touch0, touch1)
            );
            state = STATE.ZOOM;
        } else if (this.enableRotate) {
            const touch = getPos(e.touches[0]);

            this.handleRotate(touch, findPosById(touch.id, startedPos));
            state = STATE.ROTATE;
        }
    }

    handleTouchEnd(e) {
        if (e.touches.length > 0) this.handleTouchStart(e);

        this.radius *= this.scale;
        this.scale = 1;
        state = STATE.WAIT;
    }

    handleMouseDown(e) {
        e.preventDefault();

        startedPos = [getPos(e)];
        startPhi = this.phi;
        startTheta = this.theta;
        state = STATE.ROTATE;
    }

    handleMouseMove(e) {
        if (!this.enableRotate) return;
        if (state !== STATE.ROTATE) return;

        this.handleRotate(getPos(e), startedPos[0]);
    }

    handleMouseUp() {
        state = STATE.WAIT;
    }

    handleWheel(e) {
        if (!this.enableZoom) return;

        if (e.deltaY > 0) {
            this.handleZoom(this.scale * this.zoomSpeed);
        } else {
            this.handleZoom(this.scale / this.zoomSpeed);
        }
        state = STATE.ZOOM;
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
        el.addEventListener("wheel", (e) => {
            this.handleWheel(e);
        });
        el.addEventListener("mousedown", (e) => {
            this.handleMouseDown(e);
        });
        el.addEventListener("mousemove", (e) => {
            this.handleMouseMove(e);
        });
        el.addEventListener("mouseup", this.handleMouseUp);
        el.addEventListener("mouseleave", this.handleMouseUp);
    }
    get element() {
        return this._element;
    }
}

function getPos(obj) {
    return {
        id: obj.identifier ?? 1,
        x: obj.pageX,
        y: obj.pageY,
    };
}

function findPosById(id, array) {
    let pos;
    for (pos of array) {
        if ((pos.id = id)) break;
    }
    return pos;
}

function getLen(pos0, pos1) {
    return Math.sqrt((pos0.x - pos1.x) ** 2 + (pos0.y - pos1.y) ** 2);
}
