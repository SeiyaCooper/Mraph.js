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
     */
    constructor({
        radii = [1, 1],
        heightSegments = 1,
        phiStarts = 0,
        phiEnds = Math.PI * 2,
        phiSegments = 32,
        heights = 1,
    } = {}) {
        super();
        this.radii = radii;
        this.heightSegments = heightSegments;
        this.heights = heights;

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

            // get vertices
            for (let j = 0; j <= heightSegments; j++) {
                for (let i = 0; i < phiSegments; i++) {
                    const phi = phiStart + i * phiUnit;
                    const r = topRadius + j * radiusUnit;
                    const h = heightStart + j * heightUnit;

                    vertices.push(Math.cos(phi) * r, h, Math.sin(phi) * r);
                }
            }

            // get indices
            for (let i = 0; i < heightSegments; i++) {
                for (let j = 0; j < phiSegments; j++) {
                    const n = j + 1 === phiSegments ? 0 : j + 1;

                    if ((phiStart > 0 || phiEnd < Math.PI * 2) && n === 0)
                        continue;

                    const offset = baseOffset + i * phiSegments;
                    const a = offset + j;
                    const b = offset + phiSegments + j;
                    const c = offset + phiSegments + n;
                    const d = offset + n;

                    addPlane(a, b, c, d);
                }
            }
        }

        let baseHeight = 0;
        for (let i = 0; i < this.radii.length - 1; i++) {
            const phiStart = this.phiStarts[i] ?? this.phiStarts;
            const phiEnd = this.phiEnds[i] ?? this.phiEnds;
            const phiSegments = this.phiSegments[i] ?? this.phiSegments;
            const height = this.heights[i] ?? this.heights;
            const heightSegments =
                this.heightSegments[i] ?? this.heightSegments;

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

        this.setAttribute("position", vertices, 3);
        this.setIndex(indices);
    }
}
