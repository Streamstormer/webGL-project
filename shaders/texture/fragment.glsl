precision highp float;
uniform sampler2D u_texture;

varying vec2 v_texCoords;
varying float v_Dot;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoords);
	gl_FragColor.rgb *= v_Dot;

}
