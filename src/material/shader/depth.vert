attribute vec3 position;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;
uniform float far;
uniform float near;
uniform vec3 cameraPos;

varying float v_distance;

void main() {
    gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
    v_distance = distance(cameraPos, position) / (near - far) + 1.0;
}
