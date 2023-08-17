import Matrix from "../src/math/Matrix.js";

test("Matrix", () => {
    const m1 = new Matrix([
        [1, 2, 3],
        [1, 1, 1],
        [23, 213, 223],
    ]);
    const m2 = new Matrix([
        [1, 1, 2],
        [2, 3, 4],
        [34, 24, 123],
    ]);

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

    expect(Matrix.from(m1)).toEqual(m1);
    expect(Matrix.from(3, 3, 1)).toEqual(
        new Matrix([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ])
    );
});
