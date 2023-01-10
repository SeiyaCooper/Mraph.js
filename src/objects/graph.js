//所有可绘制类的基类 负责初始化工作
class Graph {
    constructor(...args) {
        this.visible = true;
        this.stroke = {
            color: "black"
        };
        this.fill = {
            color: "rgba(0,0,0,0)"
        };
        
        Object.assign(this, args[args.length - 1]);
    }
    
    set layer(layer) {
        this._layer = layer;
        layer.elements.push(this);
    }
    get layer() {
        return this._layer;
    }
    
    // 更改大小动画
    resizeTo(scale, start, end) {
        let initialSize, total; // 初始大小, 变化总量
        
        Mraph.animation.add(start, end, {
            start: () => {
                initialSize = this.size;
                total = initialSize * scale - initialSize;
            },
            update: p => {
                this.size = initialSize + total * p;
            }
        });
    }
}

export default Graph;