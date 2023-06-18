import Action from "./action.js";

export default class ActionList {
    list = new Map();
    maxTime = 0;
    minTime = Infinity;

    /**
     * add an action to action list
     * @param {Number} start
     * @param {Number} stop
     * @param {Object} handle
     * @return {ActionList}
     */
    add(start, stop, handle) {
        const action = new Action(handle);
        const list = this.list;
        const index = [start * 1000, stop * 1000];

        if (list.has(index)) {
            list.set(index, list.get(index).merge(action));
        } else {
            list.set(index, action);
        }

        this.maxTime = Math.max(stop * 1000, this.maxTime);
        this.minTime = Math.min(start * 1000, this.minTime);

        return this;
    }

    play() {
        const list = this.list;
        const startTime = +new Date();
        const minTime = this.minTime;
        const maxTime = this.maxTime;
        let timer;

        (function animate() {
            const now = +new Date() - startTime;

            for (const [index, action] of list) {
                action.excute(...index, now);
                if (action.isStopped) list.delete(index);
            }

            if (now < minTime) {
                timer = requestAnimationFrame(animate);
                return;
            } else if (now > maxTime) {
                cancelAnimationFrame(timer);
                return;
            }

            timer = requestAnimationFrame(animate);
        })();
    }
}
