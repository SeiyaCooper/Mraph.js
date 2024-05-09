import Event from "./Event.js";
import SpecialEvent from "./SpecialEvent.js";

const STATE = {
    STOPPED: "STOPPED",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
};

let eventId = 0;

export default class Timeline {
    /**
     * A short string to describe state
     * @type {string}
     */
    state = STATE.STOPPED;

    /**
     * list for events to be called
     * @type {Event[]}
     */
    events = [];

    /**
     * list for events which would be called during active
     * @type {SpecialEvent[]}
     */
    globalEvents = [];

    /**
     * list for events that would always be called,
     * those events will keep this timeline active
     * @type {SpecialEvent[]}
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
     * @return {Event}
     */
    add(
        start,
        stop,
        handle,
        {
            updateMax = true,
            updateMin = true,
            curve = Timeline.easeInOutSine,
        } = {}
    ) {
        const event = new Event(start, stop, handle, { curve });
        event.id = eventId;
        eventId++;

        this.events.push(event);

        if (updateMax) this._maxTime = Math.max(stop * 1000, this._maxTime);
        if (updateMin) this._minTime = Math.min(start * 1000, this._minTime);

        return event;
    }

    /**
     * add a one-time-only event
     * @param {number} at
     * @param {Function} handler
     */
    once(at, handler) {
        return this.add(at, at, { start: handler });
    }

    /**
     * add an event to event list following last event
     * @param {Number} hold
     * @param {Object} handler
     * @param {Object} config
     * @return {this}
     */
    addFollow(hold, handler, config) {
        return this.add(this.maxTime, this.maxTime + hold, handler, config);
    }

    /**
     * add global event
     * @param {Function} handler
     * @returns {this}
     */
    addGlobal(handler) {
        const event = new SpecialEvent(handler);
        event.id = eventId;
        eventId++;
        this.globalEvents.push(event);
    }

    /**
     * add infinity event
     * @param {Function} handler
     * @returns {this}
     */
    addInfinity(handler) {
        const event = new SpecialEvent(handler);
        event.id = eventId;
        eventId++;
        this.infinityEvents.push(event);
    }

    /**
     * delete an event from this timeline
     * @param {object | number} target
     */
    delete(target) {
        if (typeof target === "number") this.deleteById(target);
        this.deleteById(target.id);
    }

    /**
     * delete an event accroding to its id
     * @param {number} id
     */
    deleteById(id) {
        for (let index in this.events) {
            if (this.events[index].id === id) this.events.splice(index, 1);
        }
        for (let index in this.infinityEvents) {
            if (this.infinityEvents[index].id === id)
                this.infinityEvents.splice(index, 1);
        }
        for (let index in this.globalEvents) {
            if (this.globalEvents[index].id === id)
                this.globalEvents.splice(index, 1);
        }
    }

    /**
     * start palying animation
     * @returns {void}
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

    /**
     * trigger events by current time
     */
    process() {
        const events = this.events;
        const now = this.current;

        for (let handler of this.infinityEvents) {
            handler.execute();
        }

        if (now > this.minTime || this.infinityEvents.length !== 0) {
            for (let handler of this.globalEvents) {
                handler.execute();
            }
        }

        if (now < this.minTime) return;
        for (let event of events) {
            event.execute(now);
        }
    }

    /**
     * Stop palying aniamtion
     */
    pause() {
        if (this.clock) this.state = STATE.PAUSED;
    }

    /**
     * Linear function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static linear = (t) => t;

    /**
     * Quadratic ease in function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInQuad = (t) => t * t;

    /**
     * Quadratic ease out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    /**
     * Quadratic ease in out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    /**
     * Sine ease in function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInSine = (t) => 1 - Math.cos((t * Math.PI) / 2);

    /**
     * Sine ease out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeOutSine = (t) => Math.sin((t * Math.PI) / 2);

    /**
     * Sine ease in out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

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
        for (const event of this.events) {
            if (!event.isStopped) isStopped = false;
        }
        return isStopped;
    }
}
