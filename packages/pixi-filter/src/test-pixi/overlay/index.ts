import "shared/normalize.css";
import "./style.css";

import vertex from "../basic/pass.vert?raw";
import fragment from "./test.frag?raw";
import perlinNoise from "./perlin.jpg";

import {
  Application,
  Assets,
  Geometry,
  Mesh,
  Shader,
  QuadGeometry,
} from "pixi.js";

const canvas = document.querySelector("canvas")!;

// const gl = canvas.getContext("webgl")!;

// const render = () => {
//   gl.clearColor(0, 0, 0, 0.8);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//   requestAnimationFrame(render);
// };
const app = new Application();

(async () => {
  await app.init({
    canvas,
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    backgroundAlpha: 0,
  });

  const geometry = new QuadGeometry();
  geometry.addAttribute("aPosition", [
    -app.screen.width,
    -app.screen.height,
    app.screen.width,
    -app.screen.height,
    app.screen.width,
    app.screen.height,
    -app.screen.width,
    app.screen.height,
  ]);
  geometry.addAttribute("aUv", [0, 0, 1, 0, 1, 1, 0, 1]);
  const mesh = new Mesh({
    shader: Shader.from({
      gl: { vertex, fragment },
      resources: {
        uTexture: (await Assets.load(perlinNoise)).source,
        uniforms: { uLimit: { type: "f32", value: 0.0 } },
      },
    }),
    geometry,
    blendMode: "screen",
  });

  app.stage.addChild(mesh);

  const startTime = Date.now();
  let time = 0;
  app.ticker.add(() => {
    time += (Date.now() - startTime) * 1e-3;
  });
  // app.ticker.add(() => {
  //   mesh.shader!.resources.uniforms.uniforms.uLimit += 0.005;
  //   // Math.sin(time * 0.5) * 0.35 + 0.5;
  //   // time * 0.125;
  // });

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => {
    app.ticker.add(() => {
      mesh.shader!.resources.uniforms.uniforms.uLimit += 0.005;
    });
  });
})();
// render();
