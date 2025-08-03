import Action from "./Action.js";

const STATES = {
    STOPPED: "STOPPED",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
};

let actionId = 0;

export default class Timeline {
    /**
     * A short string to describe current state
     * @type {string}
     */
    state = STATES.STOPPED;

    /**
     * list for normal actions
     * @type {Action[]}
     */
    actions = [];

    /**
     * list for evnets which would be called whenever timeline is active
     * @type {Action[]}
     */
    globalActions = [];

    /**
     * list of actions that would always be called, which will keep this timeline active
     * @type {Action[]}
     */
    infiniteActions = [];

    /**
     * list of actions that would be called only one time.
     * @type {Action[]}
     */
    onceActions = [];

    /**
     * Returns the value of returned by calling requsetAnimationFrame()
     * Default to be null
     * @type {number | null}
     */
    clock = null;

    /**
     * The logical frames per second (FPS) of this timeline.
     * When set to a positive value (>0), the animation will advance by a fixed step (1/fps seconds) each frame.
     * When set to a non-positive value (<=0), the animation will advance by the actual time interval between frames.
     * Default to be 0.
     * @type {number}
     */
    logicalFps = 0;

    /**
     * The minimum real duration (in seconds) between frames when fps is positive.
     * Only have effect when both Timeline.fps and this are positive (>0).
     * If rendering takes longer than this duration, it will have no effect.
     * @type {number}
     */
    durationSec = 0;

    /**
     * Max time (in milliseconds)
     * @type {number}
     * @see maxTime
     */
    _maxMs = 0;

    /**
     * Min time (in milliseconds)
     */
    _minMs = Infinity;

    /**
     * Internal timestamp (in milliseconds) when the timeline was last started.
     * @private
     * @type {number}
     */
    startTime = 0;

    /**
     * Elapsed time (in milliseconds) when Timeline.forward() was last called.
     * @private
     * @type {number}
     */
    current = 0;

    /**
     * The index of current frame.
     * @private
     * @type {number}
     */
    frame = 0;

    /**
     * Adds an action to this timeline.
     * @param {Number} startAt start time in seconds
     * @param {Number} duration duration time in seconds
     * @param {object} configs Configuration object, optional
     * @param {(progress: number, elapsedTimeSec: number) => void} configs.onUpdate Update callback, optional
     * @param {() => void} configs.onStart Start callback, optional
     * @param {() => void} configs.onStop Stop callback, optional
     * @param {(progress: number) => number} configs.curve Animation curve function, optional
     * @param {number} configs.priority
     * @return {Action} The action instance created
     */
    add(startAt, duration, { onUpdate, onStart, onStop, curve = Timeline.easeInOutCubic, priority = 0 } = {}) {
        const action = new Action(startAt, duration, {
            onUpdate,
            onStart,
            onStop,
            curve,
            priority,
        });
        action.id = actionId;
        actionId++;

        this.actions.push(action);
        this.actions.sort((a, b) => b.priority - a.priority);

        this.maxMs = Math.max((startAt + duration) * 1000, this.maxMs);
        this.minMs = Math.min(startAt * 1000, this.minMs);

        return action;
    }

    /**
     * Adds a one-time-only action.
     * @param {number} at
     * @param {Function} handler
     * @return {Action}
     */
    addOnce(at, handler) {
        const onceAction = new Action(at, 0, {
            onActive: handler,
        });

        this.maxMs = Math.max(at * 1000, this.maxMs);
        this.minMs = Math.min(at * 1000, this.minMs);

        onceAction.id = actionId;
        actionId++;
        this.onceActions.push(onceAction);
        this.onceActions.sort((a, b) => b.priority - a.priority);

        return onceAction;
    }

    /**
     * Adds an action to action list following last action.
     * @param {Number} holdSec
     * @param {object} configs Configuration object, optional
     * @param {(progress: number, elapsedTimeSec: number) => void} configs.onUpdate Update callback, optional
     * @param {() => void} configs.onStart Start callback, optional
     * @param {() => void} configs.onStop Stop callback, optional
     * @param {(progress: number) => number} configs.curve Animation curve function, optional
     * @param {number} configs.priority
     * @return {Action}
     */
    addFollowing(holdSec, configs) {
        const offset = configs.offset ?? 0;
        return this.add(this.maxSec, holdSec + offset, configs);
    }

    /**
     * Adds a global action, this action will be called whenever timeline is active
     * If there is any infinite action attached to this timeline, it would behaved like a infinite action, otherwise it would behaved like an action that spans from begining to ending
     * @param {Function} handler
     * @returns {Action}
     */
    addGlobal(configs) {
        const globalAction = new Action(this.minSec, this.maxSec - this.minSec, configs);

        globalAction.id = actionId;
        actionId++;
        this.globalActions.push(globalAction);
        this.globalActions.sort((a, b) => b.priority - a.priority);

        return globalAction;
    }

    /**
     * Adds an infinite action
     * @param {Function} handler
     * @returns {Action}
     */
    addInfinite(handler) {
        const action = new Action(0, Infinity, {
            onActive: handler,
        });

        action.id = actionId;
        actionId++;
        this.infiniteActions.push(action);
        this.infiniteActions.sort((a, b) => b.priority - a.priority);

        return action;
    }

    /**
     * Deletes an action from this timeline
     * @param {object | number} target
     */
    delete(target) {
        if (typeof target === "number") this.deleteById(target);
        this.deleteById(target.id);
    }

    /**
     * Deletes an action accroding to its id
     * @param {number} id
     */
    deleteById(id) {
        for (let index in this.actions) {
            if (this.actions[index].id === id) this.actions.splice(index, 1);
        }
        for (let index in this.infiniteActions) {
            if (this.infiniteActions[index].id === id) this.infiniteActions.splice(index, 1);
        }
        for (let index in this.globalActions) {
            if (this.globalActions[index].id === id) this.globalActions.splice(index, 1);
        }
        for (let index in this.onceActions) {
            if (this.onceActions[index].id === id) this.onceActions.splice(index, 1);
        }
    }

    forward() {
        if (this.state === STATES.STOPPED) {
            this.startTime = +new Date();
            this.frame = -1;
        }
        if (this.state === STATES.PAUSED) {
            this.startTime = +new Date() - this.current;
        }
        this.state = STATES.PLAYING;

        let nowMs, nowFrame;
        if (this.logicalFps > 0) {
            if (this.durationSec > 0) {
                nowFrame = Math.floor((+new Date() - this.startTime) / 1000 / this.durationSec);
            } else {
                nowFrame = this.frame + 1;
            }
            nowMs = (nowFrame / this.logicalFps) * 1000;
        } else {
            nowMs = +new Date() - this.startTime;
        }

        this.current = nowMs;

        if (this.logicalFps <= 0) {
            this.process();
        } else if (nowFrame !== this.frame) {
            this.process();
            this.frame = nowFrame;
        }
    }

    /**
     * @returns {void}
     */
    play() {
        if (this.state === STATES.PLAYING) return;
        if (this.state === STATES.STOPPED) {
            this.startTime = +new Date();
            this.frame = -1;
        }
        if (this.state === STATES.PAUSED) {
            this.startTime = +new Date() - this.current;
        }
        this.state = STATES.PLAYING;

        let animate = () => {
            if (this.state !== STATES.PLAYING) return;
            this.forward();
            requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Triggers actions by current time
     */
    process() {
        const now = this.current;
        const nowSec = now / 1000;

        for (let action of this.infiniteActions) {
            action.onActive();
        }

        if (now >= this.minMs || this.infiniteActions.length !== 0) {
            for (let action of this.globalActions) {
                action.onActive();
            }
        }

        if (now < this.minMs) return;
        for (let action of this.actions) {
            action.execute(nowSec);
        }
        for (let action of this.onceActions) {
            if (action.isStopped) continue;
            if (nowSec >= action.startAt) {
                action.isStarted = true;
                action.isStopped = true;
                action.onActive();
            }
        }
        for (let action of this.globalActions) {
            action.execute(nowSec);
        }

        if (now < this.maxMs || !this.allStopped || this.infiniteActions.length !== 0) return;

        this.state = STATES.STOPPED;
    }

    /**
     * Pauses palying aniamtion
     */
    pause() {
        this.state = STATES.PAUSED;
    }

    /**
     * Stops palying aniamtion
     */
    halt() {
        this.state = STATES.STOPPED;
    }

    /**
     * Disposes this timeline.
     */
    dispose() {
        this.pause();

        this.infiniteActions = [];
        this.globalActions = [];
        this.actions = [];

        if (this.clock) {
            cancelAnimationFrame(this.clock);
        }
    }

    set maxSec(val) {
        this.maxMs = val * 1000;
    }

    get maxSec() {
        return this.maxMs / 1000;
    }

    set minSec(val) {
        this.minMs = val * 1000;
    }

    get minSec() {
        return this.minMs / 1000;
    }

    /**
     * @param {number} val
     */
    set maxMs(val) {
        this._maxMs = val;
        for (let action of this.globalActions) {
            action.durationSec = val / 1000 - action.startAt;
        }
    }

    /**
     * @return {number}
     */
    get maxMs() {
        return this._maxMs;
    }

    /**
     * @param {number} val
     */
    set minMs(val) {
        this._minMs = val;
        for (let action of this.globalActions) {
            action.durationSec += action.startAt - val / 1000;
            action.startAt = val / 1000;
        }
    }

    /**
     * @return {number}
     */
    get minMs() {
        return this._minMs;
    }

    get allStopped() {
        for (const action of this.actions) {
            if (!action.isStopped) return false;
        }
        for (const action of this.onceActions) {
            if (!action.isStopped) return false;
        }
        return true;
    }

    get isPlaying() {
        return this.state === STATES.PLAYING;
    }

    get isStopped() {
        return this.state === STATES.STOPPED;
    }

    get isPaused() {
        return this.state === STATES.PAUSED;
    }
}
