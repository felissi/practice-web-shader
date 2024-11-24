const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

function draw() {
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const noise = noise2D(x / 10, y / 10);
      data[(x + y * canvas.width) * 4 + 0] = noise;
      data[(x + y * canvas.width) * 4 + 1] = noise;
      data[(x + y * canvas.width) * 4 + 2] = noise;
      data[(x + y * canvas.width) * 4 + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(draw);
}

draw();
function mix(x: number, y: number, a: number) {
  return x * (1 - a) + y * a;
}
function random2d(x: number, y: number) {
  return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
}

function noise2D(x: number, y: number) {
  const X = Math.floor(x);
  const Y = Math.floor(y);
  const x0 = x - X;
  const y0 = y - Y;

  return mix(
    mix(random2d(X, Y), random2d(X + 1, Y), x0),
    mix(random2d(X, Y + 1), random2d(X + 1, Y + 1), x0),
    y0
  );
}
