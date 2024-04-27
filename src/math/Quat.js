import Vector from "./Vector.js";

export default class Quat extends Array {
    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     * @param {number} [w=0]
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z, w);
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    add(quat) {
        return new Quat(
            this.x + quat.x,
            this.y + quat.y,
            this.z + quat.z,
            this.w + quat.w
        );
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    minus(quat) {
        return new Quat(
            this.x - quat.x,
            this.y - quat.y,
            this.z - quat.z,
            this.w - quat.w
        );
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    mult(quat) {
        if (typeof quat === "number") return this.multNum(quat);

        const ans = Quat.zeros();

        const x1 = this.x;
        const y1 = this.y;
        const z1 = this.z;
        const w1 = this.w;

        const x2 = quat.x;
        const y2 = quat.y;
        const z2 = quat.z;
        const w2 = quat.w;

        ans.x = x1 * x2 - y1 * y2 - z1 * z2 - w1 * w2;
        ans.y = y1 * x2 + x1 * y2 - w1 * z2 + z1 * w2;
        ans.z = z1 * x2 + w1 * y2 + x1 * z2 - y1 * w2;
        ans.w = w1 * x2 - z1 * y2 + y1 * z2 + x1 * w2;

        return ans;
    }

    /**
     * @param {number} num
     * @returns {Quat}
     */
    multNum(num) {
        const ans = Quat.zeros();
        for (let i in this) {
            ans[i] = num * this[i];
        }
        return ans;
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    dot(quat) {
        let ans = 0;
        for (let i in this) {
            ans += this[i] * quat[i];
        }
        return ans;
    }

    /**
     * Returns a string to print this quaternion
     * @returns {string}
     */
    toString() {
        return `{${super.toString()}}`;
    }

    /**
     * @param {Quat | number[]} arraylike
     * @returns {this}
     */
    copy(arraylike) {
        this.x = arraylike[0];
        this.y = arraylike[1];
        this.z = arraylike[2];
        this.w = arraylike[3];
        return this;
    }

    /**
     * Returns [0,0,0,0]
     * @returns {Quat}
     */
    static zeros() {
        return new Quat(0, 0, 0, 0);
    }

    /**
     * Create a quternion from a scalar
     * @param {number} num
     * @returns {Quat}
     */
    static fromScalar(num) {
        return new Quat(num, num, num, num);
    }

    /**
     * @param {number} val
     */
    set norm(val) {
        this.copy(this.multNum(val / this.norm));
    }

    /**
     * @returns {number}
     */
    get norm() {
        return Math.sqrt(this.dot(this));
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
     * @param {number} val
     */
    set z(val) {
        this[2] = val;
    }

    /**
     * @returns {number}
     */
    get z() {
        return this[2];
    }

    /**
     * @param {number} val
     */
    set w(val) {
        this[3] = val;
    }

    /**
     * @returns {number}
     */
    get w() {
        return this[3];
    }

    /**
     * Conjugate quternion
     */
    get C() {
        return new Quat(this.x, -this.y, -this.z, -this.w);
    }

    get I() {
        return this.C.multNum(1 / this.dot(this));
    }

    /**
     * returns scalar part of this quternion
     */
    get scalar() {
        return this[0];
    }

    /**
     * returns vector part of this quternion
     */
    get vector() {
        return new Vector(this[1], this[2], this[3]);
    }
}
