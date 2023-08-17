import Matrix from "../src/math/Matrix.js";

test("Matrix operation", () => {
    const m1 = new Matrix([1, 2, 3], [1, 1, 1], [23, 213, 223]);
    const m2 = new Matrix([1, 1, 2], [2, 3, 4], [34, 24, 123]);
    const v1 = new Matrix([1, 2, 34]);

    expect(m1).toEqual([
        [1, 2, 3],
        [1, 1, 1],
        [23, 213, 223],
    ]);
    expect(m1.mult(m2)).toEqual([
        [48, 429, 450],
        [97, 859, 901],
        [2887, 26291, 27555],
    ]);
    expect(m1.add(m2)).toEqual([
        [2, 3, 5],
        [3, 4, 5],
        [57, 237, 346],
    ]);
    expect(Matrix.from(3, 2, 1)).toEqual([
        [1, 1, 1],
        [1, 1, 1],
    ]);
    expect(Matrix.identity(2)).toEqual([
        [1, 0],
        [0, 1],
    ]);
    expect(m1.mult(v1)[0]).toEqual([785, 7246, 7587]);
    expect(v1.trans(m1)).toEqual(m1.mult(v1));
});
