precision highp float;
uniform sampler2D u_texture;
uniform float uAlpha;


varying float v_diffuse;
varying vec2 v_texCoords;



void main() {
    vec4 color = texture2D(u_texture, v_texCoords);
	color.a *=  uAlpha;
	gl_FragColor = color * (vec4(v_diffuse)+ 0.8);

}
