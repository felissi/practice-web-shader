import { Application, Assets, Geometry, Mesh, Shader } from "pixi.js";
import image from "../../assets/original.png";
import vertex from "./pass.vert?raw";
import fragment from "./pass.frag?raw";

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    preference: "webgl",
  });
  document.body.appendChild(app.canvas);

  const quadGeometry = new Geometry({
    attributes: {
      aPosition: [-100, -100, 100, -100, 100, 100, -100, 100],
      aUv: [0, 0, 1, 0, 1, 1, 0, 1],
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
    topology: "triangle-list",
  });

  const shader = Shader.from({
    gl: { vertex, fragment },
    resources: {
      uTexture: (await Assets.load(image)).source,
    },
  });

  const quad = new Mesh({
    geometry: quadGeometry,
    shader,
  });

  app.stage.addChild(quad);

  app.ticker.add(() => {
    quad.position.set(app.screen.width / 2, app.screen.height / 2);
    // quad.width = app.screen.width;
    // quad.height = app.screen.height;
  });
})();
