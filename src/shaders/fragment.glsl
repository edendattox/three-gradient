uniform float time;
uniform float progress;

varying vec3 vColor;
varying vec2 vUv;


void main() {
   gl_FragColor = vec4(vColor, .1);
}
