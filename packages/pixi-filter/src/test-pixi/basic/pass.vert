#version 300 es
in vec2 aPosition;
in vec2 aUv;

out vec2 vUv;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

void main(void) {
  mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
  gl_Position = vec4((mvp * vec3(aPosition, 1.0f)).xy, 0.0f, 1.0f);
  vUv = aUv;
}
