attribute vec3 position;
attribute vec3 previous;
attribute float reverse;

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelMat;
uniform float aspect;

uniform float thickness;

!slot::get_color

void main() {
    mat4 MVPMat = projectionMat * viewMat * modelMat;

    vec4 projected = MVPMat * vec4(position, 1.0);
    vec4 previousProjected = MVPMat * vec4(previous, 1.0);

    vec2 screen = projected.xy / projected.w;
    screen.x *= aspect;
    vec2 previousScreen = previousProjected.xy / previousProjected.w;
    previousScreen.x *= aspect;

    vec2 dir = normalize(screen - previousScreen);
    vec2 normal = vec2(dir.y, -dir.x);

    normal *= thickness;
    normal.x /= aspect;

    gl_Position.xy = projected.xy + normal * reverse;
    gl_Position.zw = projected.zw;

    !slot::get_color::main
}
