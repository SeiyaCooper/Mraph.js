import {
    WebglRenderer,
    Program,
    Camera,
    Control,
    COLORS,
    OBJLoader,
    Texture,
} from "../../src/mraph.js";

const vs = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 cameraMat;

    varying vec3 v_normal;
    varying vec2 v_uv;

    void main() {
        gl_Position = cameraMat * vec4(position, 1.0);
        v_normal = normal;
        v_uv = uv;
    }
`;
const fs = `
    precision mediump float;

    varying vec3 v_normal;
    varying vec2 v_uv;

    uniform sampler2D sampler;

    void main() {
        float shade = dot(normalize(vec3(1, 3, 7)), v_normal);
        vec3 propor_color = texture2D(sampler, v_uv).rgb;

        gl_FragColor.rgb = propor_color * 0.8 + shade * 0.2;
        gl_FragColor.a = 1.0;
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
    attributes: { position: 3, normal: 3, uv: 2 },
});

let mesh = {
    webglMode: gl.TRIANGLES,
    attributes: {
        position: {},
        normal: {},
        uv: {},
    },
};
(async () => {
    const data = await OBJLoader.parseToObject("./Rubik's Cube.obj");
    mesh.attributes.position.data = data.position;
    mesh.attributes.normal.data = data.normal;
    mesh.attributes.uv.data = data.uv;
    mesh.indices = data.position.length / 3;
    requestAnimationFrame(render);
})();

const texture = new Texture(gl);
const img = new Image();
img.src = "./Rubik's Cube.png";
img.onload = () => {
    texture.image = img;
    texture.magFilter = gl.NEAREST;
    texture.upload();
};

function render() {
    control.update();
    program.setUniform("cameraMat", camera.matrix);
    renderer.clear(...COLORS.GRAY_E);
    renderer.render(mesh, program);
    requestAnimationFrame(render);
}
