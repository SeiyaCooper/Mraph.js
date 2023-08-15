import * as utils from "../utils/utils.js";

export default class Action {
    /**
     * @type {Function}
     */
    start = () => {};

    /**
     * @type {Function}
     */
    update = () => {};

    /**
     * @type {Function}
     */
    stop = () => {};

    /**
     * @type {Boolean}
     */
    isStarted = false;

    /**
     * @type {Boolean}
     */
    isStopped = false;

    /**
     * @constructor
     * @param {Object} handle - the object to construct by
     *                          which may include function start(), update(), stop()
     * @return {Action}
     */
    constructor(handle) {
        utils.mergeObject(this, handle);
    }

    /**
     * excute this action by current time
     * @param {Number} start - the start time
     * @param {Number} stop - the stop time
     * @param {Number} now - the current time
     * @return {null}
     */
    excute(start, stop, now) {
        if (this.isStarted && !this.isStopped) {
            if (now > stop) {
                this.update(1, stop - start);
                this.stop();
                this.isStopped = true;
            } else {
                this.update((now - start) / (stop - start), now - start);
            }
        } else if (now > start) {
            this.start();
            this.update(0, 0);
            this.isStarted = true;
        }
    }

    /**
     * merge this action with another
     * they should have same start time and stop time
     * @param {Action} - another action
     * @return {Action}
     */
    merge(action) {
        this.start = () => {
            action.start();
            this.start();
        };
        this.update = (p, e) => {
            action.update(p, e);
            this.update(p, e);
        };
        this.stop = () => {
            action.stop();
            this.stop();
        };

        return this;
    }
}
