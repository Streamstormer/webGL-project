precision highp float;
uniform mat4 modelViewProjection;
// passed in vertex
attribute vec4 vertex;

void main() {
    gl_Position = modelViewProjection * vertex;
}
