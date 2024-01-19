import * as mp from "../../src/mraph.js";

const layer = new mp.Layer().appendTo(document.body);

const box = new mp.Box();

layer.add(box);

layer.render();
