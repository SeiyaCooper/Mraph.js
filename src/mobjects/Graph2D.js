import Vector from "../math/Vector.js";
import Geometry from "../geometry/Geometry.js";
import * as VECTORS from "../constants/vectors.js";
import Color from "../core/Color.js";
import Segment from "../geometry/Segment.js";

const CMD = {
    MOVE: 0,
    LINE: 1,
    FILL: 2,
    STROKE: 3,
};

export default class Graph2D extends Geometry {
    normal = VECTORS.OUT();
    up = VECTORS.UP();

    pointBuffer = [];
    commandBuffer = [];

    fillColor = new Color(1, 1, 1, 1);
    strokeColor = new Color(1, 1, 1, 1);
    strokeWidth = 0.05;

    begin() {
        this.pointBuffer = [];
        this.commandBuffer = [];
    }

    move(pos) {
        this.pointBuffer.push(pos);
        this.commandBuffer.push(CMD.MOVE);
    }

    line(pos) {
        this.pointBuffer.push(pos);
        this.commandBuffer.push(CMD.LINE);
    }

    stroke() {
        const pb = this.pointBuffer;
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
        const vertices = [];
        const colors = [];
        const position = this.getAttribute("position");

        const pb = this.pointBuffer;
        const cb = this.commandBuffer;

        function fillPolygon(self, startIndex, endIndex) {
            const basePoint = self.toWorldPos(pb[startIndex]);
            for (let i = startIndex + 1; i < endIndex; i++) {
                vertices.push(...basePoint);
                vertices.push(...self.toWorldPos(pb[i]));
                vertices.push(...self.toWorldPos(pb[i + 1]));

                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
                colors.push(...self.fillColor);
            }
        }

        function addPolygon(self, i) {
            // if the last command is move
            if (i === cb.length - 1) return;

            let endIndex = cb.findIndex((el, index) => {
                if (index <= i) return false;
                if (el === CMD.LINE) return false;
                return true;
            });

            if (endIndex === i + 1) return;
            if (endIndex === -1) endIndex = cb.length;

            fillPolygon(self, i, endIndex - 1);
        }

        for (let i = 0; i < cb.length; i++) {
            const cmd = cb[i];
            if (cmd === CMD.MOVE) {
                addPolygon(this, i);
            }
        }

        pb.push(null);
        cb.push(CMD.FILL);

        this.setAttribute("position", position.concat(vertices), 3);
        this.setAttribute("color", vertices, 3);
        this.setIndex(vertices.length / 3);
    }

    clear() {
        this.begin();
        this.clearChildren();
        this.setAttribute("position", [], 3);
    }

    toWorldPos(pos) {
        pos = Vector.fromArray(pos);
        const xAsix = this.up.cross(this.normal);
        const yAsix = this.normal.cross(xAsix);

        yAsix.norm = pos[1];
        xAsix.norm = pos[0];

        return xAsix.add(yAsix);
    }
}
