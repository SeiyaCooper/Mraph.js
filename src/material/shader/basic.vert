attribute vec3 position;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;

void main() {
    gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
}
