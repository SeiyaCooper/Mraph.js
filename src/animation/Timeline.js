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
     * list for evnets which would be called whenever timeline is active
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
     * Returns value of requsetAnimationFrame()
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
     * The duration between each frame when fps is setted.
     * @type {number}
     */
    duration = 0;

    /**
     * Adds an event to this timeline.
     * @param {Number} start
     * @param {Number} stop
     * @param {object} handle
     * @param {object} config
     * @return {Event}
     */
    add(
        startTime,
        stopTime,
        { update, start, stop, updateMax = true, updateMin = true, curve = Timeline.easeInOutCubic } = {}
    ) {
        const event = new Event(startTime, stopTime, {
            update,
            start,
            stop,
            curve,
        });
        event.id = eventId;
        eventId++;

        this.events.push(event);

        if (updateMax) this._maxTime = Math.max(stopTime * 1000, this._maxTime);
        if (updateMin) this._minTime = Math.min(startTime * 1000, this._minTime);

        return event;
    }

    /**
     * Adds a one-time-only event.
     * @param {number} at
     * @param {Function} handler
     */
    once(at, handler) {
        return this.add(at, at, { stop: handler });
    }

    /**
     * Adds an event to event list following last event.
     * @param {Number} hold
     * @param {object} configs
     * @return {this}
     */
    addFollow(hold, configs) {
        return this.add(this.maxTime, this.maxTime + hold, configs);
    }

    /**
     * Adds an event beginning at the earliest time and concluding at the latest time.
     * @param {object} config
     * @returns {this}
     */
    addWhole(handler, config) {
        return this.add(this.minTime, this.maxTime, config);
    }

    /**
     * Adds a global event, this event will be called whenever timeline is active。
     * If there is an infinity event attached to this timeline, it would behaved like infinity events, otherwise it would behaved like whole events.
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
     * Adds an infinity event
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
     * Deletes an event from this timeline
     * @param {object | number} target
     */
    delete(target) {
        if (typeof target === "number") this.deleteById(target);
        this.deleteById(target.id);
    }

    /**
     * Deletes an event accroding to its id
     * @param {number} id
     */
    deleteById(id) {
        for (let index in this.events) {
            if (this.events[index].id === id) this.events.splice(index, 1);
        }
        for (let index in this.infinityEvents) {
            if (this.infinityEvents[index].id === id) this.infinityEvents.splice(index, 1);
        }
        for (let index in this.globalEvents) {
            if (this.globalEvents[index].id === id) this.globalEvents.splice(index, 1);
        }
    }

    /**
     * Starts palying animation
     * @returns {void}
     */
    play() {
        const self = this;
        const startTime = +new Date();
        let frame = 0,
            lastFrame;

        this.state = STATE.PLAYING;
        (function animate() {
            if (self.state !== STATE.PLAYING) return;

            let now;
            if (self.fps) {
                if (self.duration) {
                    frame = Math.floor((+new Date() - startTime) / 1000 / self.duration);
                } else {
                    frame++;
                }
                now = frame / self.fps;
            } else {
                now = (+new Date() - startTime) / 1000;
            }

            if (now > self.maxTime && self.allStopped && self.infinityEvents.length === 0) {
                self.state = STATE.STOPPED;
                return;
            }

            self.current = now;
            if (frame !== lastFrame) self.process();
            self.clock = requestAnimationFrame(animate);

            if (self.fps && self.duration) lastFrame = frame;
        })();
    }

    /**
     * Triggers events by current time
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
     * Stops palying aniamtion
     */
    pause() {
        if (this.clock) this.state = STATE.PAUSED;
    }

    /**
     * Disposes this timeline.
     */
    dispose() {
        this.pause();

        this.infinityEvents = [];
        this.globalEvents = [];
        this.events = [];
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
    static easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    /**
     * Cubic ease in function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInCubic = (t) => t * t * t;

    /**
     * Cubic ease out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    /**
     * Cubic ease in out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

    /**
     * Bounce ease in function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInBounce = (t) => 1 - Timeline.easeOutBounce(1 - t);

    /**
     * Bounce ease out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeOutBounce = (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    };

    /**
     * Bounce ease in out function
     * @param {number} t - process, 0 to 1
     * @returns {number}
     */
    static easeInOutBounce = (t) =>
        t < 0.5 ? (1 - Timeline.easeOutBounce(1 - 2 * t)) / 2 : (1 + Timeline.easeOutBounce(2 * t - 1)) / 2;

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
