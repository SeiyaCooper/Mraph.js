import * as MathFunc from "./math_func.js";
import Vector from "./Vector.js";

export default class Color extends Vector {
    /**
     * @param {number} [r=0]
     * @param {number} [g=0]
     * @param {number} [b=0]
     * @param {number} [a=1]
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b, a);
    }

    withRGBA({ r, g, b, a }) {
        return new Color(r ?? this.r, g ?? this.g, b ?? this.b, a ?? this.a);
    }

    toArray() {
        return [...this];
    }

    toIntRGBA() {
        const ans = new Color();

        for (let i = 0; i < 3; i++) {
            ans[i] = parseInt(this[i] * 255);
        }
        ans[3] = this[3];

        return ans;
    }

    toRGBAStr() {
        return `rgba(${this.join()})`;
    }

    toIntRGBAStr() {
        return `rgba(${this.toIntRGBA().join()})`;
    }

    static fromHex(hex) {
        if (hex <= 16777215 /*0xffffff*/) {
            const r = ((hex >> 16) & 255) / 255;
            const g = ((hex >> 8) & 255) / 255;
            const b = (hex & 255) / 255;
            return new Color(r, g, b, 1);
        } else {
            const r = ((hex >> 24) & 255) / 255;
            const g = ((hex >> 16) & 255) / 255;
            const b = ((hex >> 8) & 255) / 255;
            const a = (hex & 255) / 255;
            return new Color(r, g, b, a);
        }
    }

    static fromHexStr(str) {
        return Color.fromHex(Number.parseInt(str.substring(1), 16));
    }

    static lerpRGBA(from, to, p) {
        return MathFunc.lerpArray(from, to, p);
    }

    static isInstance(obj) {
        return obj instanceof Color;
    }

    set r(val) {
        this[0] = val;
    }

    get r() {
        return this[0];
    }

    set g(val) {
        this[1] = val;
    }

    get g() {
        return this[1];
    }

    set b(val) {
        this[2] = val;
    }

    get b() {
        return this[2];
    }

    set a(val) {
        this[3] = val;
    }

    get a() {
        return this[3];
    }
}
