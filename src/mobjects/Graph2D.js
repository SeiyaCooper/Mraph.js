import Geometry from "../geometry/Geometry.js";
import * as VECTORS from "../constants/vectors.js";
import Color from "../core/Color.js";
import Segment from "../geometry/Segment.js";

const CMD = {
    MOVE: 0,
    LINE: 1,
    FILL: 2,
    STROKE: 3,
    ARC: 4,
};

export default class Graph2D extends Geometry {
    normal = VECTORS.OUT();
    up = VECTORS.UP();

    argumentBuffer = [];
    commandBuffer = [];

    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;

    begin() {
        this.argumentBuffer = [];
        this.commandBuffer = [];
    }

    move(pos) {
        this.argumentBuffer.push(pos);
        this.commandBuffer.push(CMD.MOVE);
    }

    line(pos) {
        this.argumentBuffer.push(pos);
        this.commandBuffer.push(CMD.LINE);
    }

    arc(radius, startAngle, endAngle, clockwise = true) {
        this.argumentBuffer.push([radius, startAngle, endAngle, clockwise]);
        this.commandBuffer.push(CMD.ARC);
    }

    stroke() {
        const pb = this.argumentBuffer;
        const cb = this.commandBuffer;

        function createSegment(Type, self, i) {
            const seg = new Type(
                self.toWorldPos(pb[i]),
                self.toWorldPos(pb[i + 1])
            );
            seg.strokeColor = self.strokeColor;
            seg.strokeWidth = self.strokeWidth;
            seg.update();
            return seg;
        }

        function addSegment(self, i) {
            switch (cb[i + 1]) {
                case CMD.LINE:
                    self.addChild(createSegment(Segment, self, i));
                    return false;
                default:
                    return true;
            }
        }

        function addSegments(self, i) {
            for (let j = i; j < cb.length; j++) {
                if (addSegment(self, j)) break;
            }
        }

        for (let i = 0; i < cb.length; i++) {
            const cmd = cb[i];
            if (cmd === CMD.MOVE) {
                addSegments(this, i);
            }
        }

        pb.push(null);
        cb.push(CMD.STROKE);
        this.combineChildren();
    }

    fill() {
        const vertices = this.getAttribute("position");
        const colors = this.getAttribute("color");

        const pb = this.argumentBuffer;
        const cb = this.commandBuffer;

        function fillPolygon(self, startIndex) {
            let endIndex = cb.findIndex((el, index) => {
                if (index <= startIndex) return false;
                if (el === CMD.LINE) return false;
                return true;
            });

            if (endIndex === startIndex + 1) return;
            if (endIndex === -1) endIndex = cb.length;

            const basePoint = self.toWorldPos(pb[startIndex]);
            for (let i = startIndex + 1; i < endIndex - 1; i++) {
                vertices.push(...basePoint);
                vertices.push(...self.toWorldPos(pb[i]));
                vertices.push(...self.toWorldPos(pb[i + 1]));

                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
            }
        }

        function fillArc(self, index) {
            const c = pb[index];
            const basePoint = self.toWorldPos(c);
            const sin = Math.sin,
                cos = Math.cos;
            let [r, stAng, edAng, clockwise] = pb[index + 1];
            let unit;

            if (stAng > edAng) {
                stAng = edAng;
                edAng = pb[index + 1][1];
                clockwise = !clockwise;
            }

            if (clockwise) {
                unit = (edAng - stAng - Math.PI * 2) / 25;
            } else {
                unit = (edAng - stAng) / 25;
            }

            function fillTriangle(ang) {
                vertices.push(...basePoint);
                vertices.push(
                    ...self.toWorldPos([
                        cos(ang) * r + c[0],
                        sin(ang) * r + c[1],
                    ])
                );
                vertices.push(
                    ...self.toWorldPos([
                        cos(ang + unit) * r + c[0],
                        sin(ang + unit) * r + c[1],
                    ])
                );

                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
            }

            for (let i = 0; i < 25; i++) {
                fillTriangle(stAng + i * unit);
            }
        }

        function startFill(self, i) {
            // if the last command is move
            if (i === cb.length - 1) return;

            switch (cb[i + 1]) {
                case CMD.LINE:
                    fillPolygon(self, i);
                    return false;
                case CMD.ARC:
                    fillArc(self, i);
                    return false;
                default:
                    return true;
            }
        }

        for (let i = 0; i < cb.length; i++) {
            const cmd = cb[i];
            if (cmd === CMD.MOVE) {
                startFill(this, i);
            }
        }

        pb.push(null);
        cb.push(CMD.FILL);

        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
        this.setIndex(vertices.length / 3);
    }

    clear() {
        this.begin();
        this.clearChildren();
        this.setAttribute("position", [], 3);
    }

    toWorldPos(pos) {
        const xAsix = this.up.cross(this.normal);
        const yAsix = this.normal.cross(xAsix);

        yAsix.norm = pos[1];
        xAsix.norm = pos[0];

        return xAsix.add(yAsix);
    }

    setColor(color) {
        this.strokeColor = color;
        this.fillColor = color;
    }
}
