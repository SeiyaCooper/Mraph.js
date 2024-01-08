export const POINTS = 0;
export const LINE_STRIP = 1;
export const LINE_LOOP = 2;
export const LINES = 3;
export const TRIANGLE_STRIP = 4;
export const TRIANGLE_FAN = 5;
export const TRIANGLES = 6;

export function toWebGLMode(gl, mode) {
    switch (mode) {
        case POINTS:
            return gl.POINTS;
        case LINE_STRIP:
            return gl.LINE_STRIP;
        case LINE_LOOP:
            return gl.LINE_LOOP;
        case LINES:
            return gl.LINES;
        case TRIANGLE_STRIP:
            return gl.TRIANGLE_STRIP;
        case TRIANGLE_FAN:
            return gl.TRIANGLE_FAN;
        case TRIANGLES:
            return gl.TRIANGLES;
        default:
            return;
    }
}
