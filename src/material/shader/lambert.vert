attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;

varying vec4 v_color;
varying vec3 v_normal;

void main() {
    gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
    v_color = color;
    v_normal = normal;
}
