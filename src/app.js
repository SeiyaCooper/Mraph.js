window.Mraph = {
    elements: [],

    //初始化
    setup(container, config) {
        const main = document.createElement("canvas");
        container.appendChild(main);

        if (config) {
            if (config.width) {
                main.width = 3 * config.width;
                main.style.width = config.width + "px";
            }
            if (config.height) {
                main.height = 3 * config.height;
                main.style.height = config.height + "px";
            }
        }
        
        this.canvas = main;
    },
    // 绘制全体
    draw() {
        const els = this.elements;
        for (const obj of els) {
            obj.draw();
        }
    },
    // 设置背景
    background(color = "white") {
        this.ctx2d.fillStyle = color;

        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx2d.fillRect(-w/2, -h/2, w, h);
    },

    set canvas(canvas) {
        this._canvas = canvas;

        const ctx = canvas.getContext("2d");
        this.ctx2d = ctx;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1);
    },
    get canvas() {
        return this._canvas;
    },
};

export default Mraph;