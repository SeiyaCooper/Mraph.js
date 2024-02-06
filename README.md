# Mraph.js
[![npm](https://img.shields.io/npm/v/mraph)](https://www.npmjs.com/package/mraph)
[![GitHub](https://img.shields.io/github/license/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/blob/main/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/SeiyaCooper/Mraph.js)](https://github.com/SeiyaCooper/Mraph.js/commits/main)

Mraph.js is a library for drawing geometric shapes in browser  
[Github](https://github.com/SeiyaCooper/Mraph.js) | 
[NPM](https://www.npmjs.com/package/mraph) | 
[Examples](/Mraph.js/gallery)

> [!IMPORTANT]
> This lib is for personal use

# Usage

## Install with npm:

```shell
npm install --save mraph
```

## A short example:

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

[See more](/Mraph.js/gallery)

# Contribution

Feel free to contribute to this repo
