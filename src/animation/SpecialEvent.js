/**
 * infinite event or global event
 */
export default class SpecialEvent {
    /**
     * @type {Function}
     */
    update = () => {};

    /**
     * @type {number}
     */
    id = 0;

    /**
     * @param {Function} updater
     */
    constructor(updater) {
        this.update = updater;
    }

    /**
     * trigger this event
     */
    execute() {
        this.update();
    }
}
