#version 300 es

precision mediump float;

out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uLimit;

in vec2 vUv;

void main(void) {
  float color = texture(uTexture, fract(vUv * 2.0f)).r;
  color = smoothstep(uLimit - 0.01f, uLimit, color);
  fragColor = vec4(vec3(0.0f), color);
}
