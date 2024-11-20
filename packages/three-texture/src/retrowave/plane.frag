precision highp float;

// #define GLSLIFY 1
varying vec3 vPosition;

void main(void) {
  float opacity = (96.0 - length(vPosition)) / 256.0 * 0.6;
  vec3 color = vec3(.6);
  gl_FragColor = vec4(color, opacity);
}
