import * as DrawModes from "../constants/draw_modes.js";
import Geometry from "./Geometry.js";

export default class Sphere extends Geometry {
    constructor({
        radius = 1,
        phiStart = 0,
        phiEnd = Math.PI * 2,
        phiSegments = 32,
        thetaStart = 0,
        thetaEnd = Math.PI,
        thetaSegments = 16,
    } = {}) {
        super();
        this.radius = radius;

        this.phiStart = phiStart;
        this.phiEnd = phiEnd;
        this.phiSegments = phiSegments;

        this.thetaStart = thetaStart;
        this.thetaEnd = thetaEnd;
        this.thetaSegments = thetaSegments;
    }

    update() {
        const phiStart = this.phiStart;
        const phiSegments = this.phiSegments;
        const phiUnit = (this.phiEnd - phiStart) / phiSegments;

        const thetaStart = this.thetaStart;
        const thetaUnit = (this.thetaEnd - thetaStart) / this.thetaSegments;

        const r = this.radius;

        const vertices = [];
        const indices = [];

        // get vetices
        for (let i = 0; i <= this.thetaSegments; i++) {
            for (let j = 0; j < phiSegments; j++) {
                const phi = phiStart + j * phiUnit;
                const theta = thetaStart + i * thetaUnit;

                vertices.push(
                    r * Math.cos(phi) * Math.sin(theta),
                    r * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta)
                );
            }
        }

        function addPlane(a, b, c, d, mode) {
            if (mode === DrawModes.LINES) {
                indices.push(a, b, c);
                indices.push(b, d, c);
            } else {
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        // get indices
        for (let i = 0; i < this.thetaSegments; i++) {
            for (let j = 0; j < phiSegments; j++) {
                const n = j + 1 === phiSegments ? 0 : j + 1;

                if ((phiStart > 0 || this.phiEnd < Math.PI * 2) && n === 0)
                    continue;

                const offset = i * phiSegments;
                const a = offset + j;
                const b = offset + phiSegments + j;
                const c = offset + phiSegments + n;
                const d = offset + n;

                addPlane(a, b, c, d, this.mode);
            }
        }

        this.setAttribute("position", vertices, 3);
        this.setIndex(indices);
    }
}
