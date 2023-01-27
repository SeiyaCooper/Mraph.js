export class Layer {
    elements = [];

    constructor(canvas, config) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        if (config.width) this.canvas.width = config.width;
        if (config.height) this.canvas.height = config.height;

        const ctx = this.context;
        ctx.translate(0.5 * canvas.width, 0.5 * canvas.height);
        ctx.scale(1, -1);
    }
    create(type, ...attrs) {
        if (attrs.length === 1) {
            createSingle(type, attrs);
        } else {
            return attrs.map((attr) => {
                createSingle(type, attr);
            });
        }

        function createSingle(type, attr) {
            const output = new type(...attr);
            output.layer = this;
            this.elements.push(output);
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
}
