import {
    WebglRenderer,
    Program,
    Camera,
    Control,
    COLORS,
    OBJLoader,
} from "../../src/mraph.js";

const vs = `
    attribute vec3 position;
    uniform mat4 cameraMat;
    void main() {
        gl_Position = cameraMat * vec4(position, 1.0);
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
camera.position[2] = 2;

const control = new Control(camera);

const gl = renderer.gl;

const program = new Program(gl, {
    vs,
    fs,
    attributes: { position: 3 },
});

let mesh = {
    glMode: gl.LINES,
    attributes: {
        position: {},
    },
    indices: {
        data: {},
    },
};
(async () => {
    const data = await OBJLoader.parseToObject("./Rubik's Cube.obj");
    mesh.attributes.position.data = data.position;
    mesh.indices.data = data.index;
    console.log(Math.max(...mesh.indices.data), mesh);
    requestAnimationFrame(render);
})();

function render() {
    control.update();
    program.setUniform("cameraMat", camera.matrix);
    renderer.clear(...COLORS.GRAY_E);
    renderer.render(mesh, program);
    requestAnimationFrame(render);
}
