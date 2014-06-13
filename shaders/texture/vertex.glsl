precision highp float;
uniform mat4 modelViewProjection;
uniform mat4 u_normalMatrix;
uniform vec3 u_lightDir;
//uniform vec3 u_lightDir2;

// passed in vertex
attribute vec4 vertex;
attribute vec3 normal;
attribute vec2 texCoords;

// passed out texCoords
varying vec2 v_texCoords;
varying float v_diffuse;

void main() {
	vec4 transNormal = u_normalMatrix * vec4(normal, 1);
	v_diffuse = max(dot(u_lightDir, transNormal.xyz), 0.0);
	v_texCoords = texCoords;
	gl_Position = modelViewProjection * vertex;
}
