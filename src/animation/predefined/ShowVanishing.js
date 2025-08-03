import ShowCreation from "./ShowCreation.js";

/**
 * @param {Mobject} target
 * @param {object} [configs={}] - your personal configurations of the event.
 */
export default function ShowVanishing(target, { runTime = 1.5, ...configs } = {}) {
    const showCraetion = ShowCreation(target, { runTime, ...configs });

    return {
        onStart: () => {
            showCraetion.onStart();
        },
        onUpdate: (p) => {
            showCraetion.onUpdate(1 - p);
        },
        ...configs,
    };
}
