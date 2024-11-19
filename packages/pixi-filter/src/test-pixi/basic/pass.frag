#version 300 es

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;

void main(void) {
  fragColor = texture(uTexture, vUv);
}
