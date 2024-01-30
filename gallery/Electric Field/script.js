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
const chargeList = [
    new Charge(3, 0, 0),
    new Charge(0.5, 0, 3),
    new Charge(2, 0, 1),
    new Charge(1, -1, 0),
    new Charge(0.1, 2, 0),
];
for (let charge of chargeList) {
    layer.add(charge);
}

// Init electric field
const electricField = new mp.VectorField2D();
electricField.func = (x, y) => {
    const force = new mp.Vector(0, 0, 0);
    const pos = new mp.Vector(x, y, 0);

    for (let charge of chargeList) {
        const radius = pos.reduce(charge.center).mult(charge.charge).normal();
        force.copy(force.add(radius));
    }

    return force;
};
layer.add(electricField);

// Use orbit control and start animation
layer.enableOrbitControl();
layer.play();
