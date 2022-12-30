//所有可绘制类的基类 负责初始化工作
class Graph {
    constructor(...args) {
        this.color = "black";
        this.visible = true;
        this.fillColor = "rgba(0,0,0,0)";
        
        //是否加入绘制列表
        if (args[args.length - 1] !== false) {
            Mraph.elements.push(this);
        }
    }
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