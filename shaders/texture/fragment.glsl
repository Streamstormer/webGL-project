precision highp float;
uniform sampler2D u_texture;

varying vec2 v_texCoords;
varying float v_Dot;

uniform float uAlpha;

void main() {
	vec4 textureColor = texture2D(u_texture, vec2(v_texCoords.s, v_texCoords.t));
	gl_FragColor = vec4(textureColor.rgb * v_Dot, textureColor.a * uAlpha);

}

/*precision mediump float;

  varying vec2 vTextureCoord;
  varying vec3 vLightWeighting;

  uniform float uAlpha;

  uniform sampler2D uSampler;

  void main(void) {
     vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
     gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);
  }*/
