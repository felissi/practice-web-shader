#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

in vec3 position;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main(void) {
  gl_Position = vec4(position, 1.0f);
  vTexCoord = aTexCoord;
}
