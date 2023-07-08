import Vector from "../math/Vector.js";

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    render(el, mat) {
        const ctx = this.context;
        for (let p of el.path) {
            this[p[0]](p[1], mat);
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
    
    move(pos, mat) {
        pos = pos.resize(4, 1).trans(mat);
        pos = pos.mult(1/pos.columns[3]).columns;
        this.context.moveTo(...pos);
        return this;
    }
    
    line(pos, mat) {
        pos = pos.resize(4, 1).trans(mat);
        pos = pos.mult(1/pos.columns[3]).columns;
        this.context.lineTo(...pos);
        return this;
    }
    
    arc(param, mat) {
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
