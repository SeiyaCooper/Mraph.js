// core
import Layer from "./core/layer.js";

// object
import Point from "./object/point.js";
import Segment from "./object/segment.js";
import Line from "./object/line.js";
import Arc from "./object/arc.js";

// utils
import * as utils from "./utils/utils.js";

// constant
import * as Constant from "./constant/constant.js";

export { Layer, Point, Segment, Line, Arc, utils, Constant };

if (typeof window === "object" && typeof document === "object") {
    window.Mraph = {};
    utils.copy(window.Mraph,
        { Layer, Point, Segment, Line, Arc, utils, Constant });
}
