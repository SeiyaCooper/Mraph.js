export default class Graph {
    strokeColor = "black";
    strokeWidth = 5;
    strokeDash = [];
    fillColor = "rgba(0,0,0,0)";
    visible = true;

    constructor() {
        this.size = 5;
    }

    draw(createPath) {
        if (!this.layer || !this.visible) return;
        const ctx = this.layer.context;

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineDash = this.strokeDash;
        ctx.fillStyle = this.fillColor;

        ctx.beginPath();
        createPath(ctx);
        ctx.closePath();

        ctx.stroke();
        ctx.fill();
    }

    set size(value) {
        this.strokeWidth = value;
    }
    get size() {
        return this.strokeWidth;
    }
}
