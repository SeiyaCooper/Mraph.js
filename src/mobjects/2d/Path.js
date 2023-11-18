import Graph2D from "../Graph2D.js";
import Line from "./Line.js";
import Program from "../../core/Program.js";

const vertexShader = `
    attribute vec3 position;
    attribute vec4 color;

    uniform mat4 cameraMat;
    uniform mat4 modelMat;

    varying vec4 v_color;

    void main() {
        gl_Position = cameraMat * modelMat * vec4(position, 1.0);
        v_color = color;
    }
`;

const fragmentShader = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

export default class Path extends Graph2D {
    _close = false;

    constructor(...points) {
        super();
        this.points = points;
    }

    update() {
        const segments = [];
        const points = this.points;

        for (let i = 0; i < points.length - 1; i++) {
            segments.push(new Line(points[i], points[i + 1]));
        }
        if (this.close) {
            segments.push(new Line(points[points.length - 1], points[0]));
        }

        this.children = segments;
    }

    prepareToRender() {
        super.prepareToRender();
        this.program = new Program(this.gl, {
            vs: vertexShader,
            fs: fragmentShader,
            attributes: {
                position: 3,
                color: 4,
            },
        });
    }

    set close(val) {
        this._close = val;
        this.update();
    }

    get close() {
        return this._close;
    }
}
