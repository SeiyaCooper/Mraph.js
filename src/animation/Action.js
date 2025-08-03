import * as AnimFunc from "./anim_func.js";

export default class Event {
    /**
     * Start time in seconds
     * @type {number}
     */
    startAt = 0;

    /**
     * Duration time in seconds
     * @type {number}
     */
    durationSec = 0;

    /**
     * @type {Function}
     */
    onStart = () => {};

    /**
     * @type {Function}
     */
    onUpdate = () => {};

    /**
     * @type {Function}
     */
    onStop = () => {};

    /**
     * @type {Function}
     */
    onActive = () => {};

    /**
     * @type {boolean}
     */
    isStarted = false;

    /**
     * @type {boolean}
     */
    isStopped = false;

    /**
     * An unique id of this action
     * This is generated automatically, you should not change this
     * @readonly
     * @type {number}
     */
    id = 0;

    /**
     * A single number used to sort actions from important(larger) to less-important(smaller)
     * @type {number}
     */
    priority = 0;

    /**
     * Animation curve
     * @param {number} t
     * @returns {number}
     */
    curve = AnimFunc.easeInOutCubic;

    /**
     * @param {number} startAt onStart time in seconds, default to be 0
     * @param {number} durationSec duration time in seconds, default to be 1
     * @param {object} config
     * @param {() => void} config.onStart start callback
     * @param {(progress: number, elapsedTimeSec: number) => void} config.onUpdate update callback
     * @param {() => void} config.onStop stop callback
     * @param {() => void} config.onActive another version of onUpdate with no parameter, used in infinite actions, global actions, etc.
     * @param {number} config.priority
     * @return {Action}
     */
    constructor(
        startAt = 0,
        durationSec = 1,
        {
            onStart = () => {},
            onStop = () => {},
            onUpdate = () => {},
            onActive = () => {},
            curve = AnimFunc.easeInOutCubic,
            priority = 0,
        } = {}
    ) {
        this.onStart = onStart;
        this.onStop = onStop;
        this.onUpdate = onUpdate;
        this.onActive = onActive;
        this.startAt = startAt;
        this.durationSec = durationSec;
        this.priority = priority;
        this.curve = curve;
    }

    /**
     * Triggers this event by current time
     * @param {number} now - the current time in seconds
     * @return {void}
     */
    execute(now) {
        if (this.isStopped) return;

        const start = this.startAt;
        const stop = this.startAt + this.durationSec;
        const progress = Math.min(this.curve((now - start) / (stop - start)), this.curve(1));
        const elapsedTimeSec = Math.min(now - start, this.durationSec);

        if (!this.isStarted && now >= start) {
            this.isStarted = true;
            this.onStart();
        }

        if (this.isStarted && !this.isStopped) {
            this.onUpdate(progress, elapsedTimeSec);
        }

        if (!this.isStopped && now >= stop) {
            this.isStopped = true;
            this.onStop();
        }
    }
}
