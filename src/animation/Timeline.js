import Event from "./Event.js";

const STATE = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
};

export default class Timeline {
    /**
     * A single number to describe state
     * 0 - stopped
     * 1 - active
     * 2 - paused
     * @type {number}
     */
    state = STATE.STOPPED;

    /**
     * list for events to be called
     * @type {Map}
     */
    events = new Map();

    /**
     * list for events which would be called during active
     * @type {Map}
     */
    globalEvents = [];

    /**
     * list for events that would always be called,
     * those events will keep this timeline active
     * @type {Map}
     */
    infinityEvents = [];

    /**
     * return value of requsetAnimationFrame()
     * @type {number | null}
     */
    clock = null;

    /**
     * @type {number}
     */
    _maxTime = 0;

    /**
     * @type {number}
     */
    _minTime = Infinity;

    /**
     * @type {number}
     */
    current = 0;

    /**
     * @type {number}
     */
    fps = 0;

    /**
     * add an event to this timeline
     * @param {Number} start
     * @param {Number} stop
     * @param {Object} handle
     * @param {Object} config
     * @return {this}
     */
    add(start, stop, handle, { updateMax = true, updateMin = true } = {}) {
        const action = new Event(handle);
        const events = this.events;
        const index = [start, stop];

        if (events.has(index)) {
            events.set(index, events.get(index).merge(action));
        } else {
            events.set(index, action);
        }

        if (updateMax) this._maxTime = Math.max(stop * 1000, this._maxTime);
        if (updateMin) this._minTime = Math.min(start * 1000, this._minTime);

        return this;
    }

    /**
     * add a one-time-only event
     * @param {number} at
     * @param {Function} handler
     */
    once(at, handler) {
        this.add(at, at, { start: handler });
    }

    /**
     * add an event to event list following last event
     * @param {Number} hold
     * @param {Object} handler
     * @param {Object} config
     * @return {this}
     */
    addFollow(hold, handler, config) {
        this.add(this.maxTime, this.maxTime + hold, handler, config);
        return this;
    }

    /**
     * add global event
     * @param {Object} handler
     * @returns {this}
     */
    addGlobal(handler) {
        this.globalEvents.push(handler);
    }

    /**
     * add infinity event
     * @param {Object} handler
     * @returns {this}
     */
    addInfinity(handler) {
        this.infinityEvents.push(handler);
    }

    /**
     * trigger events at time order
     */
    play() {
        const self = this;
        const startTime = +new Date();
        let frame = 0;

        this.state = STATE.PLAYING;
        (function animate() {
            if (self.state !== STATE.PLAYING) return;

            frame++;
            const now = self.fps
                ? frame / self.fps
                : (+new Date() - startTime) / 1000;

            if (
                now > self.maxTime &&
                self.allStopped &&
                self.infinityEvents.length === 0
            ) {
                self.state = STATE.STOPPED;
                return;
            }

            self.current = now;
            self.process();
            self.clock = requestAnimationFrame(animate);
        })();
    }

    process() {
        const events = this.events;
        const now = this.current;

        for (let handler of this.infinityEvents) {
            handler();
        }

        if (now < this.minTime) return;
        for (let handler of this.globalEvents) {
            handler();
        }
        for (let [index, action] of events) {
            action.excute(...index, now);
        }
    }

    /**
     * Stop palying aniamtion
     */
    pause() {
        if (this.clock) this.state = STATE.PAUSED;
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

    get allStopped() {
        let isStopped = true;
        for (const [, action] of this.events) {
            if (!action.isStopped) isStopped = false;
        }
        return isStopped;
    }
}
