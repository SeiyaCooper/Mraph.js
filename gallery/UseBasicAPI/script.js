import { WebglRenderer, Program, Camera, Control } from "../../src/mraph.js";

const vs = `
    attribute vec2 position;

    uniform mat4 cameraMat;

    void main() {
        gl_Position = cameraMat * vec4(position, 0.0, 1.0);
    }
`;
const fs = `
    void main() {
        gl_FragColor = vec4(0.5, 1.0, 0.7, 1.0);
    }
`;
const main = document.querySelector("#main");
main.width = window.innerWidth;
main.height = window.innerHeight;
const renderer = new WebglRenderer(main);
const camera = new Camera();
camera.perspective({ aspect: main.width / main.height });
const control = new Control(camera);

const gl = renderer.gl;
const program = new Program(gl, {
    vs,
    fs,
    attributes: { position: 2 },
    uniforms: { cameraMat: camera.matrix },
});
const mesh = {
    attributes: {
        position: { data: [1, 0, 0, 1, -1, 0] },
    },
    indices: 3,
    mode: gl.TRIANGLES,
};

function render() {
    program.setUniform("cameraMat", camera.matrix);

    control.update();
    renderer.clear();
    renderer.render(mesh, program);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
