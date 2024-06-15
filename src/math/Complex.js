export default class Complex extends Array {
    /**
     * @param {number} [i=0]
     * @param {number} [j=0]
     */
    constructor(i = 0, j = 0) {
        super(i, j);
    }

    /**
     * Adds a complex number
     * @param {Complex} comp
     * @returns {Complex}
     */
    add(comp) {
        return new Complex(this.x + comp.x, this.y + comp.y);
    }

    /**
     * Minuses a complex number
     * @param {Complex} comp
     * @returns {Complex}
     */
    minus(comp) {
        return new Complex(this.x - comp.x, this.y - comp.y);
    }

    /**
     * Mults a complex number or a real number
     * @param {Complex | number} comp
     * @returns {Complex}
     */
    mult(comp) {
        if (typeof comp === "number") return this.multNum(comp);

        const ans = new Complex();

        ans.x = this.x * comp.x - this.y * comp.y;
        ans.y = this.y * comp.x + this.x * comp.y;

        return ans;
    }

    /**
     * Mults a real number
     * @param {*} num
     * @returns {Complex}
     */
    multNum(num) {
        return new Complex(this.x * num, this.y * num);
    }

    /**
     * Returns a element-by-element product of this complex number and another
     * @param {Complex} comp
     * @returns {Complex}
     */
    elMult(comp) {
        return new Complex(this.x * comp.x, this.y * comp.y);
    }

    /**
     * Creates a complex number from an array-like object
     * @param {ArrayLike} arr
     */
    static fromArray(arr) {
        return new Complex(...arr);
    }

    /**
     * @param {number} val
     */
    set x(val) {
        this[0] = val;
    }

    /**
     * @returns {number}
     */
    get x() {
        return this[0];
    }

    /**
     * @param {number} val
     */
    set y(val) {
        this[1] = val;
    }

    /**
     * @returns {number}
     */
    get y() {
        return this[1];
    }
}
