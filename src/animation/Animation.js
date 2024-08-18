/**
 * An Animation is a group of events.
 * Those events are not special events.
 */
export default class Animation {
    events = [];

    /**
     * Adds some events to this animation
     * @param {...Event} event
     */
    add(...event) {
        this.events.push(...event);
    }
}
