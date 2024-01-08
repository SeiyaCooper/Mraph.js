import * as mp from "../../src/mraph.js";

const vertexShader = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 viewMat;
    uniform mat4 projectionMat;
    uniform mat4 modelMat;

    varying vec3 v_normal;
    varying vec2 v_uv;

    void main() {
        gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
        v_normal = normal;
        v_uv = uv;
    }
`;
const fragmentShader = `
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
const layer = new mp.Layer().appendTo(document.body);
layer.add(new mp.Plane());
layer.play();

const renderer = layer.renderer;
const gl = renderer.gl;

const mesh = new mp.Geometry();
mesh.material = new mp.CustomMaterial({ vertexShader, fragmentShader });

(async () => {
    const data = await mp.OBJLoader.parseToObject("./Rubik's Cube.obj");

    mesh.setAttribute("position", data.position, 3);
    mesh.setAttribute("uv", data.uv, 2);
    mesh.setAttribute("normal", data.normal, 3);
    mesh.indices = data.position.length / 3;

    layer.add(mesh);
})();

const texture = new mp.Texture(gl);
const img = new Image();
img.src = "./Rubik's Cube.png";
img.onload = () => {
    texture.image = img;
    texture.magFilter = gl.NEAREST;
    texture.upload();
};
