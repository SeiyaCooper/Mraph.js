import Vector from "../math/Vector.js";

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    render(el, mat) {
        const ctx = this.context;
        // 在这里设置属性
        for (let p of el.path) {
            this.renderPath(p, mat);
        }
    }

    renderPath(path, mat) {
        const ctx = this.context;

        switch (path[0]) {
            case "begin":
                ctx.beginPath();
                break;
            case "close":
                ctx.closePath();
                break;
            case "fill":
                ctx.fill();
                break;
            case "stroke":
                ctx.stroke();
                break;
            case "clear":
                this.clear();
                break;
            case "lineTo": {
                const pos = path[1].resize(4, 1).trans(mat).columns;
                const x = pos[0];
                const y = pos[1];
                const w = pos[3];
                ctx.lineTo(x / w, y / w);
                break;
            }
            case "moveTo": {
                const pos = path[1].resize(4, 1).trans(mat).columns;
                const x = pos[0];
                const y = pos[1];
                const w = pos[3];
                ctx.moveTo(x / w, y / w);
                break;
            }
            default:
                break;
        }
    }

    clear() {
        this.canvas.width = this.canvas.width;
        this.canvas = this._canvas;
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
