attribute vec3 position;
attribute vec3 normal;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;

varying vec3 v_normal;

!slot::get_color

void main() {
    gl_Position = projectionMat * viewMat * modelMat * vec4(position, 1.0);
    v_normal = normal;

    !slot::get_color::main
}
