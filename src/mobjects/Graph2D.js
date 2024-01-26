import Vector from "../math/Vector.js";
import Geometry from "../geometry/Geometry.js";
import * as VECTORS from "../constants/vectors.js";

const CMD = {
    MOVE: 0,
    LINE: 1,
};

export default class Graph2D extends Geometry {
    normal = VECTORS.OUT();
    up = VECTORS.UP();

    pointBuffer = [];
    commandBuffer = [];

    begin() {
        this.pointBuffer = [];
    }

    move(pos) {
        this.pointBuffer.push(pos);
        this.commandBuffer.push(CMD.MOVE);
    }

    line(pos) {
        this.pointBuffer.push(pos);
        this.commandBuffer.push(CMD.LINE);
    }

    fill() {
        const vertices = [];

        const pb = this.pointBuffer;
        const cb = this.commandBuffer;

        function fillPolygon(self, startIndex, endIndex) {
            const basePoint = self.toWorldPos(pb[startIndex]);
            for (let i = startIndex + 1; i < endIndex; i++) {
                vertices.push(...basePoint);
                vertices.push(...self.toWorldPos(pb[i]));
                vertices.push(...self.toWorldPos(pb[i + 1]));
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

        this.setAttribute("position", vertices, 3);
        this.setIndex(vertices.length / 3);
    }

    toWorldPos(pos) {
        pos = Vector.fromArray(pos);
        const yAsix = this.up.clone();
        const xAsix = this.up.cross(this.normal);

        yAsix.norm = pos[1];
        xAsix.norm = pos[0];

        return xAsix.add(yAsix);
    }
}
