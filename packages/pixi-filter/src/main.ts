import vertexShaderCode from "./vert.vert?raw";
import fragmentShaderCode from "./pixelate.frag?raw";
import imageUrl from "./assets/original.png";

const canvas = document.querySelector("canvas")!;

const gl = canvas.getContext("webgl2")!;

const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderCode);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader)!);
}

// make fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader)!);
}

// make program
const program = gl.createProgram()!;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program)!);
}
gl.deleteShader(vertexShader);
gl.deleteShader(fragmentShader);

// const vao = gl.createVertexArray()!;
// gl.bindVertexArray(vao);

// prettier-ignore
const vertices = [
  // vertices,    texture coords
  -1.0,1.0,0.0,     0.0,1.0,
  1.0,-1.0,0.0,     1.0,0.0,
 -1.0,-1.0,0.0,     0.0,0.0,
  1.0,1.0,0.0,      1.0,1.0,
]

// prettier-ignore
const indices = [
  0,1,2,
  0,3,1,
]

const vbo = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const ebo = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(indices),
  gl.STATIC_DRAW
);
const position = gl.getAttribLocation(program, "position");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 5 * 4, 0);
gl.enableVertexAttribArray(position);
const texcoord = gl.getAttribLocation(program, "aTexCoord");
gl.vertexAttribPointer(texcoord, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
gl.enableVertexAttribArray(texcoord);

const resolution = gl.getUniformLocation(program, "u_resolution")!;

const texture = gl.createTexture()!;

const image = new Image();
image.src = imageUrl;
image.onload = () => {
  const _canvas = document.createElement("canvas");
  _canvas.width = image.width;
  _canvas.height = image.height;
  const ctx = _canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height).data;
  // ===========================
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    image.width,
    image.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(data)
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  canvas.width = image.width;
  canvas.height = image.height;
  render();
};

const render = () => {
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  // gl.bindVertexArray(vao);

  gl.uniform2fv(resolution, [canvas.width, canvas.height]);
  // gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
};

// render();
