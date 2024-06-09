<div align="center">
    <image src='https://seiyacooper.github.io/Mraph.js/Mraph_logo.png' width="600px" alt='logo'></image>
</div>

[![npm](https://img.shields.io/npm/v/mraph)](https://www.npmjs.com/package/mraph)
[![GitHub](https://img.shields.io/github/license/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/blob/main/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/commits/main)

Mraph.js is my personal rendering engine for drawing geometric shapes in a browser, inspired by Manim  
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
import { Layer, Point, Vector } from "mraph";

// Create a new Layer
const layer = new Layer().appendTo(document.body);

// Create a new Point
const point = new Point(0, 0);

// Add the point to layer
layer.add(point);

// Set the acceleration of the point
point.a = new Vector(0.5, 1, 0);

// Start animation
layer.play();
```

Input this at any editor that you prefer,
then you would see a small white ball moving with a certain acceleration!

[See more](/Mraph.js/gallery)

# Contribution

Feel free to contribute to this repo
