import Mraph from "../app.js";

class Layer {
    constructor(config) {
        const canvas = document.createElement("canvas");
        const container = Mraph.container;
        
        this.canvas = canvas;
        this.type = "2d";
        this.width = container.style.width;
        this.height = container.style.height;
        this.elements = [];
        Object.assign(this, config);
        
        canvas.width = 3 * this.width;
        canvas.height = 3 * this.height;
        canvas.style.width = this.width;
        canvas.style.height = this.height;
        this.ctx.translate(1.5 * this.width, 1.5 * this.height);
        this.ctx.scale(1, -1);
        
        container.appendChild(canvas);
    }
    
    draw() {
        for (const obj of this.elements) {
            obj.draw();
        }
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