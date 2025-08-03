import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";
import Color from "../math/Color.js";
import Point2D from "../mobjects/2D/Point2D.js";
import Point3D from "../mobjects/3D/Point3D.js";
import MraphError from "./MraphError.js";

/**
 * @param {Object} obj
 * @param {...Object} source
 * @returns {Object}
 */
export function mergeObject(obj, ...source) {
    Object.assign(obj, ...source);
}

/**
 * @param {Object} obj
 * @returns {Object}
 */
export function deepCopy(obj) {
    let out;

    if (Color.isInstance(obj)) {
        out = new Color();
    } else if (Vector.isInstance(obj)) {
        out = new Vector();
    } else if (Matrix.isInstance(obj)) {
        out = new Matrix();
    } else if (Array.isArray(obj)) {
        out = [];
    } else {
        out = Object.create(Object.getPrototypeOf(obj));
    }

    for (let attr in obj) {
        out[attr] = typeof obj[attr] === "object" ? deepCopy(obj[attr]) : obj[attr];
    }
    return out;
}

/**
 * Try to convert into a Point2D from a source
 * @param {number[] | Point2D | Point3D | Vector} source
 * @returns {Point2D}
 */
export function tryIntoPoint2D(source) {
    if (source instanceof Point2D) {
        return source;
    } else if (source instanceof Point3D) {
        return new Point2D(source.center);
    } else if (source instanceof Vector) {
        return new Point2D(source);
    } else if (Array.isArray(source) && Number.isFinite(source[0]) && Number.isFinite(source[1])) {
        return new Point2D(source[0], source[1]);
    } else {
        MraphError.error("Failed while converting into Point2D.");
        return new Point2D(0, 0);
    }
}

/**
 * Try to convert into a Point3D from a source
 * @param {number[] | Point2D | Point3D | Vector} source
 * @returns {Point3D}
 */
export function tryIntoPoint3D(source) {
    if (source instanceof Point3D) {
        return source;
    } else if (source instanceof Point2D) {
        return new Point3D(source.center);
    } else if (source instanceof Vector) {
        return new Point3D(source);
    } else if (Array.isArray(source) && Number.isFinite(source[0]) && Number.isFinite(source[1])) {
        return new Point3D(source[0], source[1], source[2] ?? 0);
    } else {
        MraphError.error("Failed while converting into Point3D.");
        return new Point3D(0, 0, 0);
    }
}
