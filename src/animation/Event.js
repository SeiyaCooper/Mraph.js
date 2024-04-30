export default class Event {
    /**
     * @type {number}
     */
    startTime = 0;

    /**
     * @type {number}
     */
    stopTime = 1;

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
     * @type {boolean}
     */
    isStarted = false;

    /**
     * @type {boolean}
     */
    isStopped = false;

    /**
     * @type {number}
     */
    id = 0;

    /**
     * @constructor
     * @param {object} config
     * @return {Action}
     */
    constructor(
        startTime = 0,
        stopTime = 1,
        { start = () => {}, stop = () => {}, update = () => {} } = {}
    ) {
        this.start = start;
        this.stop = stop;
        this.update = update;
        this.startTime = startTime;
        this.stopTime = stopTime;
    }

    /**
     * trigger this event by current time
     * @param {number} now - the current time
     * @return {void}
     */
    execute(now) {
        const start = this.startTime;
        const stop = this.stopTime;

        if (this.isStopped) return;
        if (this.isStarted && !this.isStopped) {
            if (now > stop) {
                this.update(1, stop - start);
                this.stop(stop);
                this.isStopped = true;
            } else {
                this.update((now - start) / (stop - start), now - start);
            }
        } else if (now > start) {
            this.start(start);
            this.update(0, 0);
            this.isStarted = true;
            this.execute(start, stop, now);
        }
    }
}
