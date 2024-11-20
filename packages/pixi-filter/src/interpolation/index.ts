import { Application, Shader, Geometry, Mesh } from "pixi.js";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  const shader = Shader.from({
    gl: {
      vertex: `
        attribute vec2 aPosition;
        attribute vec3 aColor;

        varying vec3 vColor;

        uniform mat3 uProjectionMatrix;
        uniform mat3 uWorldTransformMatrix;
        uniform mat3 uTransformMatrix;

        void main() {
          vColor = aColor;  
          mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
          gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
        }
      `,
      fragment: `
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
    },
  });
  const geometry = new Geometry({
    attributes: {
      // prettier-ignore
      aPosition:[
        -100,-100,
        100,-100,
        100,100,
      ],
      // prettier-ignore
      aColor: [
        1,0,0,
        0,1,0,
        0,0,1
      ],
    },
    indexBuffer: [0, 1, 2],
    topology: "triangle-list",
  });
  const mesh = new Mesh({ geometry, shader });
  mesh.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(mesh);

  app.ticker.add(() => {});
})();
