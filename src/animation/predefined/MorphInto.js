import Animation from "../Animation.js";
import Event from "../Event.js";
import Mobject2D from "../../mobjects/2D/Mobject2D.js";
import * as MathFunc from "../../math/math_func.js";
import * as COLORS from "../../constants/colors.js";
import { deepCopy } from "../../utils/utils.js";

export default class MorphInto extends Animation {
    /**
     * @param {Mobject2D} fromMobject
     * @param {Mobject2D} toMobject
     * @param {object} [configs={}] - your personal configurations of the event.
     */
    constructor(fromMobject, toMobject, { runTime = 1, ...configs } = {}) {
        super();

        if (!Mobject2D.isInstance(fromMobject) || !Mobject2D.isInstance(toMobject)) return;

        if (toMobject.needsUpdate) {
            toMobject.update();
            toMobject.needsUpdate = false;
        }

        let fromShape = { self: [] };
        let toShape = { self: [] };
        let fromColors = { self: [] };
        let toColors = { self: [] };

        const config = {
            start: () => {
                fromShape.self = fromMobject.toMorphable();
                toShape.self = toMobject.toMorphable();
                fromColors.self = deepCopy(fromMobject.colors);
                toColors.self = deepCopy(toMobject.colors);
                alignMobject(fromShape.self, fromColors.self, toShape.self, toColors.self);
            },
            update: (p) => {
                fromMobject.fromMorphable(MathFunc.lerpArray(fromShape.self, toShape.self, p));

                const fromColorsSelf = fromColors.self;
                const toColorsSelf = toColors.self;
                for (let i = 0; i < fromColorsSelf.length; i++) {
                    fromMobject.colors[i] = {
                        fillColor: MathFunc.lerpArray(fromColorsSelf[i].fillColor, toColorsSelf[i].fillColor, p),
                        strokeColor: MathFunc.lerpArray(fromColorsSelf[i].strokeColor, toColorsSelf[i].strokeColor, p),
                    };
                }
            },
            stop: () => {
                fromMobject.polygons = toMobject.polygons;
                fromMobject.colors = toMobject.colors;
                fromMobject.redraw();
            },
            ...configs,
        };
        this.add(new Event(0, runTime, config));
    }
}

function alignMobject(mob0, colors0, mob1, colors1) {
    const polygonsNum = Math.max(mob0.length, mob1.length);
    for (let i = 0; i < polygonsNum; i++) {
        if (!mob0[i]) {
            mob0[i] = [mob1[i][0]];
            colors0[i] = { fillColor: COLORS.TRANSPARENT, strokeColor: COLORS.TRANSPARENT };
        }
        if (!mob1[i]) {
            mob1[i] = [mob0[i][0]];
            colors1[i] = { fillColor: COLORS.TRANSPARENT, strokeColor: COLORS.TRANSPARENT };
        }

        let path, targetPointsNum;
        const num0 = mob0[i].length;
        const num1 = mob1[i].length;

        if (num0 === num1) continue;
        if (num0 > num1) {
            path = mob1[i];
            targetPointsNum = num0;
        }
        if (num0 < num1) {
            path = mob0[i];
            targetPointsNum = num1;
        }

        MathFunc.insertPointsAlongPath(path, targetPointsNum);
    }
}
