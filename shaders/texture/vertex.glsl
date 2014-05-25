precision highp float;
uniform mat4 modelViewProjection;
// passed in vertex
attribute vec4 vertex;
// passed in texCoords
attribute vec2 texCoords;

// passed out texCoords
varying vec2 v_texCoords;

void main() {
    v_texCoords = texCoords;
    gl_Position = modelViewProjection * vertex;
}
