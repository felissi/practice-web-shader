#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
in vec2 vTexCoord;
uniform sampler2D uTexture;

out vec4 fragColor;

vec2 flip(vec2 uv) {
  return vec2(uv.x, 1.0f - uv.y);
}

// https://www.npmjs.com/package/@pixi/filter-pixelate?activeTab=code

vec2 mapCoord(vec2 coord) {
  coord *= u_resolution.xy;
    // coord += u_resolution.zw;

  return coord;
}

vec2 unmapCoord(vec2 coord) {
    // coord -= u_resolution.zw;
  coord /= u_resolution.xy;

  return coord;
}
vec2 pixelate(vec2 coord, vec2 size) {
  return floor(coord / size) * size;
}

void main(void) {
  vec2 coord = mapCoord(vTexCoord);
  coord = pixelate(coord, vec2(4.0f));
  coord = unmapCoord(coord);
  fragColor = texture(uTexture, flip(coord));
}
