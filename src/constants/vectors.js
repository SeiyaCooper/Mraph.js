import Vector from "../math/Vector.js";

export const ORIGIN = () => new Vector(0, 0, 0);
export const UP = () => new Vector(0, 1, 0);
export const DOWN = () => new Vector(0, -1, 0);
export const RIGHT = () => new Vector(1, 0, 0);
export const LEFT = () => new Vector(-1, 0, 0);
export const IN = () => new Vector(0, 0, -1);
export const OUT = () => new Vector(0, 0, 1);
