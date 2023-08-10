import Group from "./Group.js";
import Segment from "./Segment.js";

export default class Polygon extends Group {
    constructor(...points) {
        super();
        this.points = points;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        for (let obj of this.objs) {
            obj.render();
        }

        const renderer = this.renderer;
        renderer.style(this);
        renderer.move(this.points[0].transPos);
        for (let point of this.points) {
            renderer.line3D(point.transPos);
        }
        renderer.close();
        renderer.fill();

        return this;
    }

    set points(val) {
        this._points = val;
        this.objs = val.map((point, index, arr) => {
            index++;
            return new Segment(point, arr[index < arr.length ? index : 0]);
        });
    }
    get points() {
        return this._points;
    }
}
