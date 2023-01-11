window.Mraph = {
    layers: [],
    
    //初始化
    setup(container) {
        this.container = container;
        this.width = Number.parseInt(getComputedStyle(container).width);
        this.height = Number.parseInt(getComputedStyle(container).height);
        container.style.position = "relative";
    },
    draw() {
        for (const layer of this.layers) {
            layer.draw();
        }
    },
    background(color = "rbga(0, 0, 0, 0)") {
        const w = this.width;
        const h = this.height;
        const background = document.createElement("canvas");
        const ctx = background.getContext("2d");
        
        background.width = w;
        background.height = h;
        background.style.width = background.style.height = "100%";
        background.style.zIndex = "-1";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        
        this.backgroundColor = color;
        this.container.appendChild(background);
    },
    toDataURL() {
        const w = 3 * this.width;
        const h = 3 * this.height;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, w, h);
        
        for (const layer of this.layers) {
            ctx.drawImage(layer.canvas, 0, 0, w, h);
        }
        
        return canvas.toDataURL();
    }
};

export default Mraph;