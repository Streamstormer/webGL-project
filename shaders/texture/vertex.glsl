precision highp float;
uniform mat4 modelViewProjection;
uniform mat4 u_normalMatrix;
uniform vec3 u_lightDir;

// passed in vertex
attribute vec4 vertex;
attribute vec3 normal;
attribute vec2 texCoords;

// passed out texCoords
varying vec2 v_texCoords;
varying float v_Dot;


void main() {
    v_texCoords = texCoords;
    gl_Position = modelViewProjection * vertex;
	vec4 transNormal = u_normalMatrix * vec4(normal, 1);
	v_Dot = max(dot(transNormal.xyz, u_lightDir), 0.0);

}
