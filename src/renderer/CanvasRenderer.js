import Matrix from "../math/Matrix.js";

export default class CanvasRenderer {
    matrix = Matrix.identity(4);

    constructor(canvas) {
        this.canvas = canvas;
    }

    begin() {
        this.context.beginPath();
        return this;
    }

    close() {
        this.context.closePath();
        return this;
    }

    fill() {
        this.context.fill();
        return this;
    }

    stroke() {
        this.context.stroke();
        return this;
    }

    clear() {
        const width = this.canvas.width;
        this.canvas.width = width;
        this.canvas = this._canvas;
        return this;
    }

    style(el) {
        const ctx = this.context;
        ctx.fillStyle = el.fillColor ?? "rgba(0,0,0,0)";
        ctx.strokeStyle = el.strokeColor ?? "black";
        ctx.lineWidth = el.strokeWidth ?? 5;
        ctx.globalAlpha = el.alpha ?? 1;
        ctx.setLineDash(el.dash ?? []);
    }

    move(pos) {
        pos = pos.trans(this.matrix);
        pos = pos.mult(1 / pos.columns[3]).columns;
        this.context.moveTo(...pos);
        return this;
    }

    line3D(pos) {
        pos = pos.trans(this.matrix);
        pos = pos.mult(1 / pos.columns[3]).columns;
        this.context.lineTo(...pos);
        return this;
    }

    arc2D(centerPos, radius, stAng, edAng, anticlockwise = true) {
        const center = centerPos.columns;
        this.context.arc(
            center[0],
            center[1],
            radius,
            stAng,
            edAng,
            anticlockwise
        );
        return this;
    }

    set canvas(val) {
        this._canvas = val;
        this.context = val.getContext("2d");

        const ctx = this.context;
        ctx.translate(0.5 * val.width, 0.5 * val.height);
        ctx.scale(1, -1);
    }

    get canvas() {
        return this._canvas;
    }
}
