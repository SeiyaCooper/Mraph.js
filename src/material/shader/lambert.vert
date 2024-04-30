attribute vec3 position;
attribute vec3 normal;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;

varying vec3 v_normal;
varying vec3 v_position;

!slot::get_color

void main() {
    v_position = (modelMat * vec4(position, 1.0)).xyz;
    gl_Position = projectionMat * viewMat * vec4(v_position, 1.0);
    v_normal = (modelMat * vec4(normal, 1.0)).xyz;

    !slot::get_color::main
}
