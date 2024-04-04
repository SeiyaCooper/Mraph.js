precision mediump float;

#if !slot::light_num > 0
uniform vec3 point_light_position[!slot::light_num];
uniform vec4 point_light_color[!slot::light_num];
uniform float point_light_intensity[!slot::light_num];
#endif

varying vec4 v_color;
varying vec3 v_normal;

void main() {
    vec4 shade = vec4(0.0);

    #if !slot::light_num > 0
    for (int i = 0; i < !slot::light_num; i++) {
        vec3 pos = point_light_position[i];
        vec4 color = point_light_color[i];

        shade = shade + point_light_intensity[i] * max(dot(normalize(pos), v_normal), 0.0) * color;
    }
    #endif

    gl_FragColor = v_color + shade;
}