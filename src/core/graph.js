export default class Graph {
    strokeColor = "black";
    strokeWidth = 5;
    strokeDash = [];
    fillColor = "rgba(0,0,0,0)";
    visible = true;

    static draw(source, createPath) {
        if (!source.layer || !source.visible) return;
        const ctx = source.layer.context;

        ctx.strokeStyle = source.strokeColor;
        ctx.lineWidth = source.strokeWidth;
        ctx.lineDash = source.strokeDash;
        ctx.fillStyle = source.fillColor;

        ctx.beginPath();
        createPath(ctx);

        ctx.stroke();
        ctx.fill();
    }
}
