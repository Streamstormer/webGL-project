precision highp float;
uniform float uAlpha;

varying vec4 v_color;

void main() {
    if (v_color == vec4(0.0)) {
        discard;
    }
    vec4 color = vec4(v_color.r, v_color.g, v_color.b, v_color.a);
    gl_FragColor = color;
}
