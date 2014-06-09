precision highp float;
uniform mat4 modelViewProjection;
uniform mat4 u_normalMatrix;
attribute vec4 vertex;
attribute vec3 normal;

// passed in texCoords
attribute vec2 texCoords;

// passed out texCoords
varying vec2 v_texCoords;

varying vec3 v_normal;

void main() {
	v_texCoords = texCoords;
    vec4 transNormal = u_normalMatrix * vec4(normal, 1);
    v_normal = transNormal.xyz;
    gl_Position = modelViewProjection * vertex;
}
