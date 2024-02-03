import * as mp from "../../src/mraph.js";

const layer = new mp.Layer().appendTo(document.body);

// Custom Mobject
class Charge extends mp.Point {
    constructor(charge, x, y) {
        super([x, y, 0]);
        this.charge = charge;
        this.radius = 0.1;
        this.setColor(charge > 0 ? mp.COLORS.RED : mp.COLORS.BLUE);
    }
}

// Init charges
// Try to change the parameters!!
const chargeList = [
    new Charge(1, 0, 0),
    new Charge(0.1, 4, -4),
    new Charge(2, -3, 2),
    new Charge(-2, -1, -3),
    new Charge(-1, 3, 3),
];
for (let charge of chargeList) {
    layer.add(charge);
}

// Init electric field
const electricField = new mp.VectorField2D({ xRange: [-4, 4, 1] });
electricField.func = (x, y) => {
    const force = new mp.Vector(0, 0, 0);
    const pos = new mp.Vector(x, y, 0);

    for (let charge of chargeList) {
        let radius = pos.reduce(charge.center);

        // The inverse square law
        radius = radius.mult(charge.charge).mult(1 / radius.norm ** 3);
        force.copy(force.add(radius));
    }

    return force;
};
electricField.lengthFunc = (length) => {
    return mp.MathFunc.sigmoid(length / 2);
};
electricField.colorFunc = (x, y, length) => {
    const hue = length - 0.1;
    return mp.MathFunc.lerpArray(mp.COLORS.BLUE, mp.COLORS.RED, hue);
};
layer.add(electricField);

// Use orbit control and start animation
layer.camera.position[2] = 15;
layer.enableOrbitControl().enableRotate = false;
layer.play();
