precision mediump float;

#if !slot::point_light_num > 0
uniform vec3 point_light_position[!slot::point_light_num];
uniform vec4 point_light_color[!slot::point_light_num];
uniform float point_light_intensity[!slot::point_light_num];
#endif

#if !slot::directional_light_num > 0
uniform vec3 directional_light_direction[!slot::directional_light_num];
uniform vec4 directional_light_color[!slot::directional_light_num];
uniform float directional_light_intensity[!slot::directional_light_num];
#endif

varying vec3 v_normal;
varying vec3 v_position;

!slot::get_color

void main() {
    vec4 shade = vec4(0.0);

    #if !slot::point_light_num > 0
    for (int i = 0; i < !slot::point_light_num; i++) {
        vec3 pos = point_light_position[i];
        vec4 color = point_light_color[i];
        float intensity = point_light_intensity[i];
        vec3 lenVec = v_position - pos;

        shade += 1.0 / dot(lenVec, lenVec) * intensity * max(dot(normalize(pos), v_normal), 0.0) * color;
    }
    #endif

    #if !slot::directional_light_num > 0
    for (int i = 0; i < !slot::directional_light_num; i++) {
        vec3 dir = directional_light_direction[i];
        vec4 color = directional_light_color[i];
        float intensity = directional_light_intensity[i];

        shade += intensity * max(dot(normalize(-1.0 * dir), v_normal), 0.0) * color;
    }
    #endif

    !slot::get_color::main

    gl_FragColor.rgb = color.rgb * 0.5 + shade.rgb;
    gl_FragColor.a = color.a;
}