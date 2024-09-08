import Animation from "../Animation.js";
import Event from "../Event.js";
import ShowCreation from "./ShowCreation.js";

export default class ShowVanishing extends Animation {
    /**
     * @param {Mobject} target
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(target, { runTime = 1.5, ...configs } = {}) {
        super();

        const showCraetion = new ShowCreation(target, { runTime, ...configs });

        const config = {
            start: () => {
                showCraetion.events[0].start();
            },
            update: (p) => {
                showCraetion.events[0].update(1 - p);
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}
