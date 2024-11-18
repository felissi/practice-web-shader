#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

in vec3 position;
uniform float u_time;

// Function to create a rotation matrix around the x-axis
mat4 rotateX(float angle) {
  return mat4(1.0f, 0.0f, 0.0f, 0.0f, 0.0f, cos(angle), -sin(angle), 0.0f, 0.0f, sin(angle), cos(angle), 0.0f, 0.0f, 0.0f, 0.0f, 1.0f);
}

// Function to create a rotation matrix around the y-axis
mat4 rotateY(float angle) {
  return mat4(cos(angle), 0.0f, sin(angle), 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, -sin(angle), 0.0f, cos(angle), 0.0f, 0.0f, 0.0f, 0.0f, 1.0f);
}

// Function to create a rotation matrix around the z-axis
mat4 rotateZ(float angle) {
  return mat4(cos(angle), -sin(angle), 0.0f, 0.0f, sin(angle), cos(angle), 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f);
}

void main(void) {
  // Calculate the rotation angle
  float angle = u_time;

  float angleX = mod(u_time * 0.1f, 6.283185f); // 2 * PI
  float angleY = mod(u_time * 0.2f, 6.283185f);
  float angleZ = mod(u_time * 0.3f, 6.283185f);

  // Rotate along y-axis
  // Create the rotation matrix
  mat4 rotationMatrix = rotateX(angleX) * rotateY(angleY) * rotateZ(angleZ);
  gl_Position = rotationMatrix * vec4(position, 1.0f);
}
