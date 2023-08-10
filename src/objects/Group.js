import Graph from "./Graph.js";

export default class Group extends Graph {
    constructor(...objs) {
        super();
        this.objs = objs;
    }

    render() {
        if (!this.renderer || !this.visible) return this;

        for (let obj of this.objs) {
            obj.render();
        }

        return this;
    }

    set(attrName, val) {
        for (let obj of this.objs) {
            obj[attrName] = val;
        }
        return this;
    }

    set objs(objs) {
        this._objs = objs;
        for (let obj of objs) {
            obj.renderer = this.renderer;
        }
    }
    get objs() {
        return this._objs;
    }

    set renderer(val) {
        this._renderer = val;
        this.set("renderer", val);
    }
    get renderer() {
        return this._renderer;
    }
}
