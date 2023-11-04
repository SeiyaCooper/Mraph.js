export default class Color extends Array {
    /**
     * @param {number} [r=0]
     * @param {number} [g=0]
     * @param {number} [b=0]
     * @param {number} [a=1]
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b, a);
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toArray() {
        return [this.r, this.g, this.b, this.a];
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
        return `rgba(${this.toString()})`;
    }

    toIntRGBAStr() {
        return `rgba(${this.toIntRGBA().toString()})`;
    }
}
