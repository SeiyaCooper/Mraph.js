import Action from "./Action.js";

export default class ActionList {
    /**
     * list for actions to be called
     * @type {Map}
     */
    list = new Map();

    /**
     * @type {number}
     */
    _maxTime = 0;

    /**
     * @type {number}
     */
    _minTime = Infinity;

    /**
     * add an action to action list
     * @param {Number} start
     * @param {Number} stop
     * @param {Object} handle
     * @return {this}
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

        this._maxTime = Math.max(stop * 1000, this.maxTime);
        this._minTime = Math.min(start * 1000, this.minTime);

        return this;
    }

    /**
     * add an action to action list following last action
     * @param {Number} hold
     * @param {Object} handle
     * @return {this}
     */
    addFollow(hold, handle) {
        this.add(this.maxTime, this.maxTime + hold, handle);
        return this;
    }

    /**
     * add action globally (from  min time to max time)
     * @param {Object} handle
     * @returns {this}
     */
    addGlobal(handle) {
        const action = new Action(handle);
        const list = this.list;
        const index = [0, Infinity];

        if (list.has(index)) {
            list.set(index, list.get(index).merge(action));
        } else {
            list.set(index, action);
        }
        return this;
    }

    /**
     * equals to this.add(0, Infinity, handle)
     * @param {Object} handle
     * @returns {this}
     */
    addInfinity(handle) {
        this.add(0, Infinity, handle);
        return this;
    }

    /**
     * play this action list
     */
    play() {
        const list = this.list;
        const startTime = +new Date();
        const minTime = this._minTime;
        const maxTime = this._maxTime;
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

    set maxTime(val) {
        this._maxTime = val * 1000;
    }

    get maxTime() {
        return this._maxTime / 1000;
    }

    set minTime(val) {
        this._minTime = val * 1000;
    }

    get minTime() {
        return this._minTime / 1000;
    }
}
