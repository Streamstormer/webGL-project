precision highp float;
varying vec4 v_color;

void main() {
    if (v_color == vec4(0.0)) {
        discard;
    }
    gl_FragColor = v_color;
}
