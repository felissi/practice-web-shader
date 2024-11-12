precision mediump float;

uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(st, 0.);
  gl_FragColor = vec4(color, 1.);
}
