import Quat from "../src/math/Quat.js";

test("Quaternion operation", () => {
    const q0 = new Quat(1, 3, 45, 298);
    const q1 = new Quat(0, 12, 314, 5);

    expect(q0).toEqual([1, 3, 45, 298]);
    expect(q0.mult(q1)).toEqual([-15656, -93335, 3875, 407]);
    expect(q0.add(q1)).toEqual([1, 15, 359, 303]);
    expect(q0.minus(q1)).toEqual([1, -9, -269, 293]);
});
