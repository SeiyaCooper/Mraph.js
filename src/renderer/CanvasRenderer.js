import Matrix from "../math/Matrix.js";

export default class CanvasRenderer {
    matrix = Matrix.identity(4);

    constructor(canvas) {
        this.canvas = canvas;
        this.resolution = new Matrix([
            this.canvas.width / 2,
            this.canvas.height / 2,
            1,
            1,
        ]);
    }

    render(mesh) {
        for (let child of mesh.children ?? []) {
            this.render(child);
        }

        if (!mesh.renderByCanvas2d) return;
        mesh.renderByCanvas2d(this);
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

    clear(r, g, b, a) {
        this.context.fillStyle = `rgba(${parseInt(r * 255)}, ${parseInt(
            g * 255
        )}, ${parseInt(b * 255)}, ${a})`;

        const w = this.canvas.width;
        const h = this.canvas.height;
        this.context.fillRect(-w / 2, -h / 2, w, h);
        return this;
    }

    style(el) {
        const ctx = this.context;
        ctx.fillStyle = el.fillColor?.toIntRGBAStr() ?? "rgba(0,0,0,0)";
        ctx.strokeStyle = el.strokeColor?.toIntRGBAStr() ?? "black";
        ctx.lineWidth = el.strokeWidth * this.sceneUnit ?? 5;
        ctx.globalAlpha = el.alpha ?? 1;
        ctx.setLineDash(el.dash ?? []);
    }

    move(pos) {
        pos = new Matrix([...pos[0], 1]).trans(this.matrix);
        pos = pos.mult(1 / pos[0][3]).elMult(this.resolution)[0];
        this.context.moveTo(...pos);
        return this;
    }

    line3D(pos) {
        pos = new Matrix([...pos[0], 1]).trans(this.matrix);
        pos = pos.mult(1 / pos[0][3]).elMult(this.resolution)[0];
        this.context.lineTo(...pos);
        return this;
    }

    arc2D(centerPos, radius, stAng, edAng, anticlockwise = true) {
        let center = centerPos.trans(this.matrix);
        center = center.mult(1 / center.columns[3]).columns;
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

    /**
     * Returns the number of pixels in scene space per unit length on the screen
     */
    get sceneUnit() {
        let unit = new Matrix([1, 0, 0, 1]).trans(this.matrix);
        unit = unit.mult(1 / unit[0][3]).elMult(this.resolution)[0][0];
        return unit;
    }
}
