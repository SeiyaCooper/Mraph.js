// core
import Layer from "./core/layer.js";

// object
import Point from "./object/point.js";
import Segment from "./object/segment.js";
import Line from "./object/line.js";
import Arc from "./object/arc.js";
import Circle from "./object/circle.js";
import NumberLine from "./object/number_line.js";

// utils
import * as utils from "./utils/utils.js";

// constant
import * as Constant from "./constant/constant.js";

export { Layer, Point, Segment, Line, Arc, Circle, utils, Constant, NumberLine };

if (typeof window === "object" && typeof document === "object") {
    window.Mraph = {};
    utils.copy(window.Mraph, {
        Layer,
        Point,
        Segment,
        Line,
        Arc,
        Circle,
        utils,
        Constant,
        NumberLine
    });
}
