import * as mp from "../../src/mraph.js";

const layer = new mp.Layer().appendTo(document.body);

// Custom Mobject
class Charge extends mp.Point {
    constructor(charge, x, y) {
        super([x, y, 0]);
        this.charge = charge;
    }
}

// Init charges
// Try to change the parameters!!
const chargeList = [
    new Charge(3, 0, 0),
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
layer.add(electricField);

// Use orbit control and start animation
layer.camera.position[2] = 15;
layer.enableOrbitControl().enableRotate = false;
layer.play();
