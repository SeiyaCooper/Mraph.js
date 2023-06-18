import { copy } from "../utils/utils.js";

export default class Layer {
    elements = [];

    constructor(canvas, config) {
        this.canvas = canvas;

        copy(this, config);
        if (this.fullScreen) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }
    create(type, ...attrs) {
        const self = this;

        if (attrs.length === 1) {
            return createSingle(type, ...attrs);
        } else {
            return attrs.map((attr) => {
                return createSingle(type, attr);
            });
        }

        function createSingle(type, attr) {
            const output = new type(...attr);
            output.layer = self;
            self.elements.push(output);
            return output;
        }
    }

    draw() {
        for (const el of this.elements) {
            el.draw();
        }
    }
    background(color = "white") {
        const ctx = this.context;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = color;
        ctx.fillRect(-0.5 * w, -0.5 * h, w, h);
    }

    set canvas(canvas) {
        this._canvas = canvas;

        const ctx = canvas.getContext("2d");
        this.context = ctx;
        ctx.translate(0.5 * canvas.width, 0.5 * canvas.height);
        ctx.scale(1, -1);
    }
    get canvas() {
        return this._canvas;
    }
    set width(value) {
        this.canvas.width = value * 3;
    }
    get width() {
        return this.canvas.width;
    }
    set height(value) {
        this.canvas.height = value * 3;
    }
    get height() {
        return this.canvas.height;
    }
}
