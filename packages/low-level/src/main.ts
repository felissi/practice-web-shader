import vertexShaderCode from "./vert.vert?raw";
import fragmentShaderCode from "./frag.frag?raw";
import { indices, vertices } from "./cube";

// Time since program started in seconds
const START_TIME = Date.now() * 1e-3;

const canvas = document.querySelector("canvas")!;

const gl = canvas.getContext("webgl2")!;

// OpenGL setting
// gl.enable(gl.DEPTH_TEST);
// gl.depthFunc(gl.LEQUAL);
// gl.enable(gl.CULL_FACE);
// gl.cullFace(gl.FRONT_FACE);

// Create shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderCode);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader)!);
}
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader)!);
}

// Create program
const program: ReturnType<typeof gl.createProgram> & {
  // pointer
  resolution: WebGLUniformLocation;
  time: WebGLUniformLocation;
} = gl.createProgram()!;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program)!);
}
// Create uniforms, and point back to the shader program object
program.resolution = gl.getUniformLocation(program, "u_resolution")!;
program.time = gl.getUniformLocation(program, "u_time")!;

// Create VBO
const vertexBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const vao = gl.createVertexArray()!;
gl.bindVertexArray(vao);

// Create attribute position
const position = gl.getAttribLocation(program, "position");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);

// Create EBO
const elementBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(indices),
  gl.STREAM_DRAW
);

gl.bindVertexArray(null);

// ===========================

const render = () => {
  gl.clearColor(1, 1, 1, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // load program
  gl.useProgram(program);
  // bind vertex buffer
  // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bindVertexArray(vao);
  // provide uniform data
  gl.uniform2f(program.resolution, canvas.width, canvas.height);
  gl.uniform1f(program.time, Date.now() * 1e-3 - START_TIME);
  // Draw
  gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
  // Reset
  gl.bindVertexArray(null);
};
const loop = () => {
  render();
  const handle = requestAnimationFrame(loop);
};

window.addEventListener("resize", () => {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(program.resolution, canvas.width, canvas.height);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
});

loop();
