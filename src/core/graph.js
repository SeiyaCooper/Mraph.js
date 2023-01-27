export default class Graph {
    strokeColor = "black";
    strokeWidth = 5;
    strokeDash = [];
    fillColor = "rgba(0,0,0,0)";

    constructor() {
        this.size = 5;
    }

    setContextAttr() {
        const ctx = this.layer.context;

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineDash = this.strokeDash;
        ctx.fillStyle = this.fillColor;
    }

    set size(value) {
        this.strokeWidth = value;
    }
    get size() {
        return this.strokeWidth;
    }
}
