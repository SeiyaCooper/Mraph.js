# Mraph.js

Mraph.js is a library for drawing geometric shapes in browser  
⚠⚠⚠**This lib is still WIP**⚠⚠⚠

# Usage

Install with npm:

```shell
npm install --save mraph
```

A short example:

```JavaScript
import { Layer, Point, Vector, VectorField2D } from "mraph";

const main = document.querySelector("#main");
main.width = 1.5 * window.innerWidth;
main.height = 1.5 * window.innerHeight;

// Create a new Layer
const layer = new Layer(main);

// Create a new Point
const point = new Point(10, 2);

// Add the point to layer
layer.add(point);

// Set the acceleration of the point
point.a = new Vector([50, 40, 0, 0]);

// Start animation
layer.play();
```

# Contribution

Feel free to contribute to this repo
