precision highp float;
uniform float uAlpha;

varying vec4 v_color;

void main() {
    if (v_color == vec4(0.0)) {
        discard;
    }
    gl_FragColor += v_color.a*uAlpha;
}
