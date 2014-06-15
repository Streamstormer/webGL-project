precision highp float;
uniform mat4 modelViewProjection;
uniform float u_time;
uniform float maxAlter;

attribute vec4 vertex;
attribute vec4 initialColor;
attribute vec3 velocity;
attribute float startTime;


varying vec4 v_color;


void main() {
	vec3 tmp;
    vec4 v = vertex;
    float t = u_time - startTime;
		
    if ((t >= 0.0) && (t <= maxAlter)) {
        v_color = initialColor;
        v.xyz += t * velocity;
        gl_PointSize = 2.0;
    } else {
        v_color = vec4(0.0);
    }
    gl_Position = modelViewProjection * v;
}
