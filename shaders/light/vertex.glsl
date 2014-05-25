precision highp float;
uniform mat4 modelViewProjection;
uniform mat4 u_normalMatrix;
attribute vec4 vertex;
attribute vec3 normal;

varying vec3 v_normal;

void main() {
    vec4 transNormal = u_normalMatrix * vec4(normal, 1);
    v_normal = transNormal.xyz;
    gl_Position = modelViewProjection * vertex;
}
