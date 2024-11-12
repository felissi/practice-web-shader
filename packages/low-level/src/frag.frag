#version 300 es

precision mediump float;

out vec4 fragColor;

uniform float u_time;

void main(void) {
  vec3 color = vec3(sin(u_time), cos(u_time), 1.0f);
  fragColor = vec4(color, 1.f);
}
