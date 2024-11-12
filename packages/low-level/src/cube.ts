// prettier-ignore
export const indices=[
  0, 1, 2, 2, 3, 0,  // Front face
  4, 5, 6, 6, 7, 4,  // Back face
  4, 0, 3, 3, 7, 4,  // Left face
  1, 5, 6, 6, 2, 1,  // Right face
  3, 2, 6, 6, 7, 3,  // Top face
  4, 5, 1, 1, 0, 4   // Bottom face
]
// prettier-ignore
export const vertices = [
  // Front face
  -0.5,-0.5,0.5, // Bottom-left
  0.5, -0.5, 0.5, // Bottom-right
  0.5, 0.5, 0.5, // Top-right
  -0.5, 0.5, 0.5, // Top-left

  // Back face
  -0.5, -0.5, -0.5, // Bottom-left
  0.5, -0.5, -0.5, // Bottom-right
  0.5, 0.5, -0.5, // Top-right
  -0.5, 0.5, -0.5, // Top-left
];
