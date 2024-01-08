export default class Object3D {
    /**
     * @type {Geometry | undefined}
     */
    parent = undefined;

    /**
     * @type {Geometry[]}
     */
    children = [];

    /**
     * @param  {...Geometry} objs
     */
    addChild(...objs) {
        this.children.push(...objs);
        objs.forEach((obj) => {
            obj.parent = this;
        });
    }

    /**
     * @param  {...Geometry} objs
     */
    deleteChild(...objs) {
        objs.forEach((obj) => {
            obj.parent = undefined;
            this.children.splice(this.children.indexOf(obj), 1);
        });
    }

    /**
     * delete all children
     */
    clearChild() {
        this.deleteChild(...this.children);
    }
}
