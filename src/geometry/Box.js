import Vector from "../math/Vector.js";
import Geometry from "./Geometry.js";
import * as VECTORS from "../constants/vectors.js";

export default class Box extends Geometry {
    watchList = ["width", "height", "depth", "color", "center"];

    constructor({
        center = VECTORS.ORIGIN(),
        width = 1,
        height = 1,
        depth = 1,
    } = {}) {
        super();
        this.center = center;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    update() {
        function buildPlane(target, position, width, height, normal) {
            const yAxis = new Vector(normal[1], normal[2], normal[0]);
            yAxis.norm = height;

            const xAxis = yAxis.cross(normal);
            xAxis.norm = width;

            target.push(
                ...position,
                ...position.add(xAxis),
                ...position.add(xAxis).add(yAxis),
                ...position.add(yAxis),
                ...position,
                ...position.add(xAxis).add(yAxis)
            );
        }

        const vertices = this.getAttribute("position");
        const c = this.center,
            w = this.width,
            h = this.height,
            d = this.depth;

        buildPlane(
            vertices,
            c.add(new Vector(-w / 2, -h / 2, -d / 2)),
            w,
            h,
            VECTORS.OUT()
        );
        buildPlane(
            vertices,
            c.add(new Vector(-w / 2, -h / 2, d / 2)),
            w,
            h,
            VECTORS.OUT()
        );
        buildPlane(
            vertices,
            c.add(new Vector(w / 2, -h / 2, -d / 2)),
            h,
            d,
            VECTORS.RIGHT()
        );
        buildPlane(
            vertices,
            c.add(new Vector(-w / 2, -h / 2, d / 2)),
            h,
            d,
            VECTORS.LEFT()
        );
        buildPlane(
            vertices,
            c.add(new Vector(-w / 2, h / 2, -d / 2)),
            d,
            w,
            VECTORS.UP()
        );
        buildPlane(
            vertices,
            c.add(new Vector(w / 2, -h / 2, -d / 2)),
            d,
            w,
            VECTORS.DOWN()
        );

        this.setAttribute("position", vertices);
        this.indices = vertices.length / 3;
    }
}
