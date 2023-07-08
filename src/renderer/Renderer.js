import Vector from "../math/Vector.js";

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    render(el, mat) {
        const ctx = this.context;
        for (let p of el.path) {
            this[p[0]](p[1]);
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
        this.canvas.width = this.canvas.width;
        this.canvas = this._canvas;
        return this;
    }
    
    moveTo(pos) {
        pos = pos.resize(4, 1).trans(mat).columns;
        const x = pos[0];
        const y = pos[1];
        const w = pos[3];
        ctx.lineTo(x / w, y / w);
    }
    
    lineTo(pos) {
        pos = pos.resize(4, 1).trans(mat).columns;
        const x = pos[0];
        const y = pos[1];
        const w = pos[3];
        ctx.moveTo(x / w, y / w);
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
