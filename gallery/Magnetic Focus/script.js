import * as mp from "../../src/mraph.js";

const layer = new mp.Layer().appendTo(document.body);

/// Custom Mobjects
class UniformMagneticField extends mp.Point {
    radius = 1;

    constructor(strength, ...args) {
        super(...args);
        this.strength = strength;
        this.setColor(mp.COLORS.RED_A);
    }
}
class Charge extends mp.Point {
    constructor(charge, x, y) {
        super([x, y, 0]);
        this.charge = charge;
        this.setColor(charge > 0 ? mp.COLORS.RED : mp.COLORS.BLUE);
    }
}

/// Init charges
const chargeList = [
    new Charge(1, -2, 0.8),
    new Charge(1, -2, 0.6),
    new Charge(1, -2, 0.4),
    new Charge(1, -2, 0.2),
    new Charge(-1, -2, -0.2),
    new Charge(-1, -2, -0.4),
    new Charge(-1, -2, -0.6),
    new Charge(-1, -2, -0.8),
];
for (let charge of chargeList) {
    layer.add(charge);
    charge.v = new mp.Vector(1, 0, 0);
}

/// Init magnetic field
const field = new UniformMagneticField(new mp.Vector(0, 0, 1), 0, 0);
layer.add(field);

/// Animation part
/*
 * Lock FPS for more accurate output
 * Note: If the fps are locked, the animation will not play in real-time. Try to change the fps to 120 or higher.
 */
layer.timeline.fps = 120;
layer.timeline.addInfinity(() => {
    for (let charge of chargeList) {
        if (charge.center.norm > 1) continue;
        charge.a = charge._v.mult(charge.charge).cross(field.strength);
    }
});
layer.timeline.once(10, () => {
    layer.timeline.pause();
});

/// Render part
layer.camera.position[2] = 5;
layer.enableOrbitControl().enableRotate = false;
layer.play();
