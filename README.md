<div align="center">
    <image src='https://seiyacooper.github.io/Mraph.js/Mraph_logo.png' width="600px" alt='logo'></image>
</div>

[![npm](https://img.shields.io/npm/v/mraph)](https://www.npmjs.com/package/mraph)
[![GitHub](https://img.shields.io/github/license/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/blob/main/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/commits/main)

Mraph.js is my poor rendering engine for drawing geometric shapes in a browser, inspired by [manim](https://github.com/3b1b/manim)   
[Github](https://github.com/SeiyaCooper/Mraph.js) |
[NPM](https://www.npmjs.com/package/mraph) |
[Examples](https://seiyacooper.github.io/Mraph.js/gallery)

# Usage

### Install with npm:

```shell
npm install --save mraph
```

### or use yarn:

```shell
yarn add mraph
```

### A short example:

Once you installed, try this example below.

```js
import * as MRAPH from "mraph/src/mraph.js";

// Creates a new layer
const layer = new MRAPH.Layer().appendTo(document.body);

// Creates some points and sets their position
const pointsNum = 50;
const angleUnit = (Math.PI * 2) / pointsNum;
for (let i = 1; i <= pointsNum; i++) {
    const point = new MRAPH.Point(Math.cos(angleUnit * i) * 3, Math.sin(angleUnit * i) * 3);
    layer.add(point);
}

// Adds those points to the layer
layer.scene.children.forEach((point) => {
    layer.add(point);
});

// Sets an infinity event
// This event will remain perpetually active
layer.timeline.addInfinity(() => {
    layer.scene.children.forEach((point, i, arr) => {
        point.a = point.center.mult((-1 * i) / arr.length);
    });
});

// Starts playing animation
layer.play();
```

Input this code in your preferred text editor.
If all proceeds as it should, you will observe a series of dots engaged in a, hmm..., rather peculiar dance.

[See more (not such dances)](/Mraph.js/gallery)

# Contribution

Feel free to contribute to this repo
