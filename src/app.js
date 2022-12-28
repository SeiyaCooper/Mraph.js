import Point from "./objects/point.js";
import Segment from "./objects/segment.js";
import Line from "./objects/line.js"
import Circle from "./objects/circle.js"
import animation from "./animation/animation.js"

const mraph = {
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
    // 从数组获取点
    getPoint(array) {
        if (array instanceof Point) {
            return array;
        } else {
            return new Point(...array, false);
        }
    },
    //从点获取数组
    getPos(point) {
        if (point instanceof Point) {
            return [point.x,
                point.y];
        } else {
            return point;
        }
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
mraph.Point = Point;
mraph.Segment = Segment;
mraph.Line = Line;
mraph.Circle = Circle;
mraph.animation = animation;

window.mraph = mraph;