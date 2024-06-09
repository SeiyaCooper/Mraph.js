import Vector from "../math/Vector.js";
import * as GLENUM from "../constants/glenum.js";
import Geometry from "./Geometry.js";

export default class Cylinder extends Geometry {
    /**
     * @param {object} config
     * An object used to define following parameters, optional
     * * radii {number[]} sets radius for each cross section
     * * heightSegments {number | number[]} controls vertical segmentation.
     * *                                    You can use a uniform value for all sections by providing a single number,
     * *                                    or set diffrent values for each subpart by simply providing an array.
     * * phiStarts {number | number[]} sets start angle of azimuth. The usage is just like "heigjtSegments".
     * * phiEnds {number | number[]} sets end angle of azimuth. The usage is just like "heigjtSegments".
     * * phiSegments {number | number[]} sets segmentation along the azimuth. The usage is just like "heigjtSegments".
     * * heights {number | number[]} sets the height for each section. The usage is just like "heigjtSegments".
     * * topCap {boolean} wheather to generate the top cap of this cylinder, default true
     * * bottomCap {boolean} wheather to generate the bottom cap of this cylinder, default true
     */
    constructor({
        radii = [1, 1],
        heightSegments = 1,
        phiStarts = 0,
        phiEnds = Math.PI * 2,
        phiSegments = 32,
        heights = 1,
        topCap = true,
        bottomCap = true,
    } = {}) {
        super();
        this.radii = radii;
        this.heightSegments = heightSegments;
        this.heights = heights;
        this.topCap = topCap;
        this.bottomCap = bottomCap;

        /** azimuth */
        this.phiStarts = phiStarts;
        this.phiEnds = phiEnds;
        this.phiSegments = phiSegments;
    }

    /**
     * Implementation for Geometry.update()
     * Sets attributes of this geometry automatically.
     */
    update() {
        const vertices = [];
        const indices = [];
        const normals = [];
        const mode = this.glMode;

        function addPlane(a, b, c, d) {
            if (mode === GLENUM.LINES) {
                indices.push(a, b, c);
                indices.push(b, d, c);
            } else {
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        function buildSingle(
            topRadius,
            bottomRadius,

            phiStart,
            phiEnd,
            phiSegments,

            heightStart,
            heightEnd,
            heightSegments
        ) {
            const phiUnit = (phiEnd - phiStart) / phiSegments;
            const radiusUnit = (bottomRadius - topRadius) / heightSegments;
            const heightUnit = (heightEnd - heightStart) / heightSegments;
            const baseOffset = vertices.length / 3;
            const slope = -radiusUnit / phiUnit;

            // get vertices
            for (let j = 0; j <= heightSegments; j++) {
                for (let i = 0; i < phiSegments; i++) {
                    const phi = phiStart + i * phiUnit;
                    const r = topRadius + j * radiusUnit;
                    const h = heightStart + j * heightUnit;
                    const cosPhi = Math.cos(phi);
                    const sinPhi = Math.sin(phi);

                    vertices.push(cosPhi * r, h, sinPhi * r);
                    normals.push(...new Vector(cosPhi, slope, sinPhi).normal());
                }
            }

            // get indices
            for (let i = 0; i < heightSegments; i++) {
                for (let j = 0; j < phiSegments; j++) {
                    const n = j + 1 === phiSegments ? 0 : j + 1;

                    if ((phiStart > 0 || phiEnd < Math.PI * 2) && n === 0) continue;

                    const offset = baseOffset + i * phiSegments;
                    const a = offset + j;
                    const b = offset + phiSegments + j;
                    const c = offset + phiSegments + n;
                    const d = offset + n;

                    addPlane(a, b, c, d);
                }
            }
        }

        // Build bottom cap
        if (this.bottomCap) {
            const start = this.phiStarts[0] ?? this.phiStarts;
            const end = this.phiEnds[0] ?? this.phiEnds;
            const segment = this.phiSegments[0] ?? this.phiSegments;

            buildSingle(0, this.radii[0], start, end, segment, 0, 0, 1);
        }

        let baseHeight = 0;
        for (let i = 0; i < this.radii.length - 1; i++) {
            const phiStart = this.phiStarts[i] ?? this.phiStarts;
            const phiEnd = this.phiEnds[i] ?? this.phiEnds;
            const phiSegments = this.phiSegments[i] ?? this.phiSegments;
            const height = this.heights[i] ?? this.heights;
            const heightSegments = this.heightSegments[i] ?? this.heightSegments;

            buildSingle(
                this.radii[i],
                this.radii[i + 1],
                phiStart,
                phiEnd,
                phiSegments,
                baseHeight,
                (baseHeight += height),
                heightSegments
            );
        }

        // Build top cap
        if (this.topCap) {
            const last = this.radii.length - 1;
            const start = this.phiStarts[last] ?? this.phiStarts;
            const end = this.phiEnds[last] ?? this.phiEnds;
            const segment = this.phiSegments[last] ?? this.phiSegments;
            const r = this.radii[last];

            buildSingle(r, 0, start, end, segment, baseHeight, baseHeight, 1);
        }

        this.setAttribute("position", vertices, 3);
        this.setAttribute("normal", normals, 3);
        this.setIndex(indices);
    }
}
