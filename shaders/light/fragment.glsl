precision highp float;

const vec3 ambientMaterial = vec3(0.0, 0.0, 0.0);
const vec3 diffuseMaterial = vec3(0.55, 0.55, 0.55);
const vec3 specularMaterial = vec3(0.7, 0.7, 0.7);
const float shininess = 0.25;

uniform vec3 u_lightDir;
varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    float diffuse = max(dot(normal, u_lightDir), 0.0);
    gl_FragColor.rgb = diffuse * diffuseMaterial;
    gl_FragColor.a = 1.0;

    gl_FragColor.rgb += ambientMaterial;

    if (diffuse != 0.0) {
        vec3 reflection = normalize(reflect(-u_lightDir, normal));
        float spec = max(0.0, dot(normal, reflection));
        float specular = pow(spec, shininess);
        gl_FragColor.rgb += specularMaterial * specular;
    }
}
