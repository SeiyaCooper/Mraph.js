attribute vec3 position;
attribute vec4 color;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;

varying vec4 v_color;

void main() {
    gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
    v_color = color;
}
