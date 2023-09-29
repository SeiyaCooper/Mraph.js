export default class Color extends Array {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b, a);
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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
