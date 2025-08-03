import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

let startedPos = [],
    startTheta = 0,
    startPhi = 0,
    targetTheta = 0,
    targetPhi = 0,
    startCenter = new Vector(0, 0, 0),
    targetCenter = new Vector(0, 0, 0);

const STATE = { WAIT: 0, ROTATE: 1, ZOOM: 2, MOVE: 3 };
let state = STATE.WAIT;

export default class OrbitControl {
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

    enableMove = true;
    moveSpeed = 0.001;
    moveEase = 0.15;

    isEventsAttached = false;

    constructor(camera, { element = document } = {}) {
        this.camera = camera;
        this.element = element;
        this.radius = camera.center.norm;
    }

    update() {
        const deltaPhi = Math.min(this.deltaAngleMax, (targetPhi - this.phi) * this.rotateEase);
        const deltaTheta = Math.min(this.deltaAngleMax, (targetTheta - this.theta) * this.rotateEase);
        this.phi = Math.max(Math.min(this.phiMax, this.phi + deltaPhi), this.phiMin);
        this.theta += deltaTheta;

        const center = this.center;
        center.copy(center.lerp(targetCenter, this.moveEase));

        this.camera.center.copy(
            new Vector(0, 0, this.radius * this.scale)
                .trans(Matrix.rotateX(this.phi, 3))
                .trans(Matrix.rotateY(-this.theta, 3))
                .add(center)
        );
        this.camera.lookAt(center);
    }

    rotate(deltaPhi, deltaTheta) {
        targetPhi = startPhi + deltaPhi;
        targetTheta = startTheta + deltaTheta;
    }

    zoom(scale) {
        this.scale = scale;
    }

    move(deltaX, deltaY) {
        const camera = this.camera;
        const zAxis = this.center.minus(camera.center);
        const xAxis = zAxis.cross(camera.up);
        const yAxis = xAxis.cross(zAxis);

        xAxis.norm = deltaX * this.radius * this.scale;
        yAxis.norm = deltaY * this.radius * this.scale;

        targetCenter = startCenter.add(xAxis).add(yAxis);
    }

    handleTouchStart = ((e) => {
        e.preventDefault();

        startedPos = [];
        for (let touch of e.touches) {
            startedPos.push(getPos(touch));
        }
        startPhi = this.phi;
        startTheta = this.theta;
        startCenter.copy(this.center);
    }).bind(this);

    handleTouchMove = ((e) => {
        if (e.touches.length > 1) {
            const touch0 = getPos(e.touches[0]);
            const touch1 = getPos(e.touches[1]);
            const touchStart0 = findPosById(touch0.id, startedPos);
            const touchStart1 = findPosById(touch1.id, startedPos);

            if (this.enableZoom) {
                this.zoom(getLen(touchStart0, touchStart1) / getLen(touch0, touch1));
                state = STATE.ZOOM;
            }
            if (this.enableMove) {
                const deltaX = (touch0.x + touch1.x - touchStart0.x - touchStart1.x) / -2;
                const deltaY = (touch0.y + touch1.y - touchStart0.y - touchStart1.y) / 2;
                this.move(deltaX * this.moveSpeed, deltaY * this.moveSpeed);
            }
        } else if (this.enableRotate) {
            const pos = getPos(e.touches[0]);
            const startPos = findPosById(pos.id, startedPos);
            const deltaPhi = this.rotateSpeed * (pos.y - startPos.y);
            const deltaTheta = this.rotateSpeed * (pos.x - startPos.x);

            this.rotate(deltaPhi, deltaTheta);
            state = STATE.ROTATE;
        } else if (this.enableMove) {
            const from = getPos(e.touches[0]);
            const to = findPosById(from.id, startedPos);
            const deltaX = (to.x - from.x) * 1.5;
            const deltaY = (from.y - to.y) * 1.5;
            this.move(deltaX * this.moveSpeed, deltaY * this.moveSpeed);
        }
    }).bind(this);

    handleTouchEnd = ((e) => {
        if (e.touches.length > 0) this.handleTouchStart(e);

        this.radius *= this.scale;
        this.scale = 1;
        state = STATE.WAIT;
    }).bind(this);

    handleMouseDown = ((e) => {
        e.preventDefault();

        startedPos = [getPos(e)];
        if (e.shiftKey || !this.enableRotate) {
            state = STATE.MOVE;
            startCenter.copy(this.center);
        } else {
            startPhi = this.phi;
            startTheta = this.theta;
            state = STATE.ROTATE;
        }
    }).bind(this);

    handleMouseMove = ((e) => {
        const pos = getPos(e);
        const startPos = startedPos[0];

        if (e.shiftKey || !this.enableRotate) {
            if (!this.enableMove) return;
            if (state !== STATE.MOVE) return;
            const deltaX = (startPos.x - pos.x) * 2;
            const deltaY = (pos.y - startPos.y) * 2;
            this.move(deltaX * this.moveSpeed, deltaY * this.moveSpeed);
        } else {
            if (state !== STATE.ROTATE) return;
            const deltaPhi = this.rotateSpeed * (pos.y - startPos.y);
            const deltaTheta = this.rotateSpeed * (pos.x - startPos.x);
            this.rotate(deltaPhi, deltaTheta);
        }
    }).bind(this);

    handleMouseUp() {
        state = STATE.WAIT;
    }

    handleWheel = ((e) => {
        if (!this.enableZoom) return;

        if (e.deltaY > 0) {
            this.zoom(this.scale * this.zoomSpeed);
        } else {
            this.zoom(this.scale / this.zoomSpeed);
        }
        state = STATE.ZOOM;
    }).bind(this);

    attachControl() {
        const el = this.element;
        el.addEventListener("touchstart", this.handleTouchStart);
        el.addEventListener("touchmove", this.handleTouchMove);
        el.addEventListener("touchend", this.handleTouchEnd);
        el.addEventListener("wheel", this.handleWheel);
        el.addEventListener("mousedown", this.handleMouseDown);
        el.addEventListener("mousemove", this.handleMouseMove);
        el.addEventListener("mouseup", this.handleMouseUp);
        el.addEventListener("mouseleave", this.handleMouseUp);
        this.isEventsAttached = true;
    }

    removeControl() {
        const el = this.element;
        el.removeEventListener("touchstart", this.handleTouchStart);
        el.removeEventListener("touchmove", this.handleTouchMove);
        el.removeEventListener("touchend", this.handleTouchEnd);
        el.removeEventListener("wheel", this.handleWheel);
        el.removeEventListener("mousedown", this.handleMouseDown);
        el.removeEventListener("mousemove", this.handleMouseMove);
        el.removeEventListener("mouseup", this.handleMouseUp);
        el.removeEventListener("mouseleave", this.handleMouseUp);
        this.isEventsAttached = false;
    }

    set element(el) {
        this._element = el;
        this.attachControl();
    }

    get element() {
        return this._element;
    }

    static attachToLayer(layer, timeline, { autoRedraw = true } = {}) {
        const controlller = new OrbitControl(layer.camera, { element: layer.canvas });
        timeline.addInfinite(() => {
            controlller.update();
            if (autoRedraw) layer.redraw();
        });
        return controlller;
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
