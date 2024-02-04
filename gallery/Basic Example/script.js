import * as mp from "../../src/mraph.js";

const layer = new mp.Layer().appendTo(document.body);

const box = new mp.Box();
box.material = new mp.BasicMaterial({ color: mp.COLORS.RED });

layer.add(box);

layer.render();
