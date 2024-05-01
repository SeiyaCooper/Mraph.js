import Vector from "./Vector.js";

export default class Quat extends Array {
    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     * @param {number} [w=0]
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(w, x, y, z);
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    add(quat) {
        return new Quat(
            this.w + quat.w,
            this.x + quat.x,
            this.y + quat.y,
            this.z + quat.z
        );
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    minus(quat) {
        return new Quat(
            this.w - quat.w,
            this.x - quat.x,
            this.y - quat.y,
            this.z - quat.z
        );
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    mult(quat) {
        if (typeof quat === "number") return this.multNum(quat);

        const ans = Quat.zeros();

        const x1 = this[0];
        const y1 = this[1];
        const z1 = this[2];
        const w1 = this[3];

        const x2 = quat[0];
        const y2 = quat[1];
        const z2 = quat[2];
        const w2 = quat[3];

        ans[0] = x1 * x2 - y1 * y2 - z1 * z2 - w1 * w2;
        ans[1] = y1 * x2 + x1 * y2 - w1 * z2 + z1 * w2;
        ans[2] = z1 * x2 + w1 * y2 + x1 * z2 - y1 * w2;
        ans[3] = w1 * x2 - z1 * y2 + y1 * z2 + x1 * w2;

        return ans;
    }

    /**
     * @param {number} num
     * @returns {Quat}
     */
    multNum(num) {
        const ans = Quat.zeros();
        this.forEach((val, i) => {
            ans[i] = num * val;
        });
        return ans;
    }

    /**
     * @param {Quat} quat
     * @returns {Quat}
     */
    dot(quat) {
        let ans = 0;
        this.forEach((val, i) => {
            ans += val * quat[i];
        });
        return ans;
    }

    /**
     * print this quaternion on the console
     */
    print() {
        console.log(this.toString());
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
        this.x = arraylike[1];
        this.y = arraylike[2];
        this.z = arraylike[3];
        this.w = arraylike[0];
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
     * Create a pure quaternion by a vector
     * @param {Vector} vector
     * @returns {Quat}
     */
    static fromVector(vector) {
        return new Quat(0, ...vector);
    }

    /**
     * Returns a rotation vector
     * @param {Vector} axis
     * @param {number} angle
     * @returns {Vector}
     */
    static rotateOn(axis, angle) {
        const halfAng = angle / 2;
        return new Quat(
            Math.cos(halfAng),
            ...axis.normal().mult(Math.sin(halfAng))
        );
    }

    /**
     * Rotate a vector by certain axis and angle
     * @param {Vector} vector
     * @param {Vector | string} axis The axis to spin around, could be specified by a vector or a string.
     * @param {number} angle
     * @returns {Vector}
     */
    static rotate(vector, axis, angle) {
        let axisVec;

        if (Vector.isInstance(axis)) axisVec = axis;
        else {
            switch (axis) {
                case "x":
                    axisVec = new Vector(1, 0, 0);
                    break;
                case "y":
                    axisVec = new Vector(0, 1, 0);
                    break;
                case "z":
                    axisVec = new Vector(0, 0, 1);
                    break;
                default:
                    console.error(
                        "Mraph Error: The provided axis is not a valid value, only 'x', 'y' and 'z' is allowed."
                    );
                    return;
            }
        }

        const q = Quat.rotateOn(axisVec, angle);
        const v = Quat.fromVector(vector);
        return q.mult(v).mult(q.C).vector;
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
        this[1] = val;
    }

    /**
     * @returns {number}
     */
    get x() {
        return this[1];
    }

    /**
     * @param {number} val
     */
    set y(val) {
        this[2] = val;
    }

    /**
     * @returns {number}
     */
    get y() {
        return this[2];
    }

    /**
     * @param {number} val
     */
    set z(val) {
        this[3] = val;
    }

    /**
     * @returns {number}
     */
    get z() {
        return this[3];
    }

    /**
     * @param {number} val
     */
    set w(val) {
        this[0] = val;
    }

    /**
     * @returns {number}
     */
    get w() {
        return this[0];
    }

    /**
     * Conjugate quaternion
     */
    get C() {
        return new Quat(this.w, -this.x, -this.y, -this.z);
    }

    /**
     * Inverse quaternion
     */
    get I() {
        return this.C.multNum(1 / this.dot(this));
    }

    /**
     * returns scalar part of this quternion
     */
    get scalar() {
        return this.w;
    }

    /**
     * returns vector part of this quternion
     */
    get vector() {
        return new Vector(this.x, this.y, this.z);
    }
}
