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

    /**
     * Creates a new Color object with the specified RGBA values.
     * @param {object} [rgba={}] - An object that specifies the values for red (r), green (g), blue (b), and alpha (a) transparency.
     * @param {number} [rgba.r=0] - The red component of the color, ranging from 0 to 255.
     * @param {number} [rgba.g=0] - The green component of the color, ranging from 0 to 255.
     * @param {number} [rgba.b=0] - The blue component of the color, ranging from 0 to 255.
     * @param {number} [rgba.a=1] - The alpha (transparency) component of the color, ranging from 0 (fully transparent) to 1 (fully opaque).
     * @returns {Color} A new Color object with the updated RGBA values.
     */
    withRGBA({ r, g, b, a } = {}) {
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

    /**
     * Interpolates between the given colors and returns the interpolated color.
     * @param {Color[]} colors
     * @param {number} alpha
     * @returns
     */
    static interpolate(colors, alpha) {
        const colorsNum = colors.length - 1;

        const colorIndex = Math.floor(colorsNum * alpha);

        const fromIndex = Math.min(colorIndex, colors.length - 2);
        const toIndex = fromIndex + 1;

        return MathFunc.lerpArray(colors[fromIndex], colors[toIndex], colorsNum * alpha - fromIndex);
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
