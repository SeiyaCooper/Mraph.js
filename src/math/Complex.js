export default class Complex extends Array {
    /**
     * @param {number} [i=0]
     * @param {number} [j=0]
     */
    constructor(i = 0, j = 0) {
        super(i, j);
    }

    /**
     * The imaginary unit.
     */
    static I = new Complex(0, 1);

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
     * @param {*} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
        return obj instanceof Complex;
    }

    /**
     * Creates a complex number from an array-like object
     * @param {ArrayLike} arr
     */
    static fromArray(arr) {
        return new Complex(arr[0], arr[1]);
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

    /**
     * Sets value of the real part.
     * @param {number} val
     */
    set re(val) {
        this[0] = val;
    }

    /**
     * Returns the real part.
     * @returns {number}
     */
    get re() {
        return this[0];
    }

    /**
     * Sets value of the imaginary part.
     * @param {number} val
     */
    set im(val) {
        this[1] = val;
    }

    /**
     * Returns the imaginary part.
     * @returns {number}
     */
    get im() {
        return this[1];
    }
}
