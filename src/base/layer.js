import Mraph from "../app.js";

/**
 * Layer
 */
class Layer {
    constructor(config) {
        const canvas = document.createElement("canvas");
        const container = Mraph.container;
        
        this.canvas = canvas;
        this.type = "2d";
        this.width = Number.parseInt(getComputedStyle(container).width);
        this.height = Number.parseInt(getComputedStyle(container).height);
        this.elements = [];
        Object.assign(this, config);
        
        canvas.width = 3 * this.width;
        canvas.height = 3 * this.height
        canvas.style.background = "rgba(0, 0, 0, 0)";
        canvas.style.position = "absolute";
        canvas.style.top = canvas.style.left = "0px";
        canvas.style.width = this.width;
        canvas.style.height = this.height;
        this.ctx.translate(1.5 * this.width, 1.5 * this.height);
        this.ctx.scale(1, -1);
        
        container.appendChild(canvas);
        Mraph.layers.push(this);
    }
    
    draw() {
        for (const obj of this.elements) {
            obj.draw();
        }
    }
    background() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        ctx.clearRect(-0.5 * w, -0.5 * h, w, h);
    }
    create(...args) {
        const output = [];
        for (let i = 1; i < args.length; i++) {
            const obj = new args[0](...args[i]);
            obj.layer = this;
            output.push(obj);
        }
        return output;
    }
    
    set type(type) {
        this._type = type;
        this.ctx = this.canvas.getContext(type);
    }
    get type() {
        return this._type;
    }
}

Mraph.Layer = Layer;
export default Layer;