precision mediump float;

varying float v_distance;

void main() {
    gl_FragColor.rgb = vec3(1.0,1.0,1.0) * v_distance;
    gl_FragColor.a = 1.0;
}