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
     * Animation curve
     * @param {number} t
     * @returns {number}
     */
    curve = (t) => t;

    /**
     * @constructor
     * @param {object} config
     * @return {Action}
     */
    constructor(
        startTime = 0,
        stopTime = 1,
        { start = () => {}, stop = () => {}, update = () => {}, curve = (t) => t } = {}
    ) {
        this.start = start;
        this.stop = stop;
        this.update = update;
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.curve = curve;
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
                this.stop(stop);
                this.isStopped = true;
            } else {
                this.update(this.curve((now - start) / (stop - start)), now - start);
            }
        } else if (now > start) {
            this.start(start);
            this.isStarted = true;
        }
    }
}
