import {
  Mesh,
  PlaneGeometry,
  Group,
  Vector3,
  MathUtils,
  Plane,
  Texture,
  Camera,
  PerspectiveCamera,
  WebGLRenderer,
  OrthographicCamera,
  Scene,
  TextureLoader,
  Vector4,
  Vector2,
  Raycaster,
  Clock,
  Color,
} from "three";
import {
  MaskFunction,
  EffectComposer,
  DepthOfFieldEffect,
  VignetteEffect,
  VignetteTechnique,
} from "postprocessing";
import "./style.css";
import bgUrl from "./assets/bg.jpg";
import starsUrl from "./assets/stars.png";
import groundUrl from "./assets/ground.png";
import bearUrl from "./assets/bear.png";
import leaves1Url from "./assets/leaves1.png";
import leaves2Url from "./assets/leaves2.png";
import { LayerMaterial } from "./layerMaterial";

const canvas = document.querySelector("#scene")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const clock = new Clock();
const scene = new Scene();
const camera = new OrthographicCamera(-1, 1, 1, -1, 50, 300);
console.log(`🚀 // DEBUG 🍔  ~ file: main.ts:44 ~ `, camera);

// camera.zoom = 5;
camera.position.set(0, 0, 200);
// ####################
const renderer = new WebGLRenderer({ canvas, antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new Color(0, 0, 0));
const usePointer = () => {
  const _ = { x: 0, y: 0 };
  canvas.addEventListener(
    "mousemove",
    (event) => {
      _.x = (event.clientX / canvas.width) * 2 - 1;
      _.y = -(event.clientY / canvas.height) * 2 + 1;
    },
    { passive: true }
  );
  return _;
};
const pointer = usePointer();
const raycaster = new Raycaster();

const getAspect = (
  width: number,
  height: number,
  factor: number = 1
): [number, number, number] => {
  const v = renderer.getViewport(new Vector4());
  const adaptedHeight =
    height *
    /** aspect */ (v.width / v.height > width / height
      ? v.width / width
      : v.height / height);

  const adaptedWidth =
    width *
    /** aspect */ (v.width / v.height > width / height
      ? v.width / width
      : v.height / height);
  return [(adaptedWidth * factor) / 5, (adaptedHeight * factor) / 5, 1];
};

const movement = new Vector3();
const temp = new Vector3();

const textures = [
  bgUrl,
  starsUrl,
  groundUrl,
  bearUrl,
  leaves1Url,
  leaves2Url,
].map((_) => new TextureLoader().load(_));

const scaleN = getAspect(1600, 1000, 1.05);
const scaleW = getAspect(2200, 1000, 1.05);
console.log(`🚀 // DEBUG 🍔  ~ file: main.ts:99 ~ `, scaleN, scaleW);

const layers = [
  { texture: textures[0], x: 0, y: 0, z: 0, factor: 0.005, scale: scaleW },
  { texture: textures[1], x: 0, y: 0, z: 10, factor: 0.005, scale: scaleW },
  { texture: textures[2], x: 0, y: 0, z: 20, scale: scaleW },
  {
    texture: textures[3],
    x: 0,
    y: 0,
    z: 30,
    scaleFactor: 0.83,
    scale: scaleN,
  },
  {
    texture: textures[4],
    x: 0,
    y: 0,
    z: 40,
    factor: 0.03,
    scaleFactor: 1,
    wiggle: 0.6,
    scale: scaleW,
  },
  {
    texture: textures[5],
    x: -0,
    y: -0,
    z: 49,
    factor: 0.04,
    scaleFactor: 1.3,
    wiggle: 1,
    scale: scaleN,
  },
];
const meshes = layers.map(
  ({ scale, texture, factor = 0, scaleFactor = 1, wiggle = 0, x, y, z }, i) => {
    const geometry = new PlaneGeometry(
      ...[2, 2, wiggle ? 10 : 1, wiggle ? 10 : 1]
    );
    const material = LayerMaterial();
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    // mesh.scale.set(1.05, 1.05, 1.05);
    // mesh.scale.set(...scale);
    mesh.material.uniforms.wiggle.value = wiggle;
    mesh.material.uniforms.factor.value = factor;
    mesh.material.uniforms.scale.value = scaleFactor;
    mesh.material.uniforms.textr.value = texture;
    return mesh;
  }
);
const group = new Group();
group.add(...meshes);
scene.add(group);

// ####################

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  // // const aspect = window.innerWidth / window.innerHeight;
  // camera.left = -window.innerWidth / 2;
  // camera.right = window.innerWidth / 2;
  // camera.top = window.innerHeight / 2;
  // camera.bottom = -window.innerHeight / 2;
  // camera.updateProjectionMatrix();
  // renderer.render(scene, camera);
});
const draw = () => {
  const scaleN = getAspect(1600, 1000, 1.05);
  const scaleW = getAspect(2200, 1000, 1.05);

  const delta = clock.getDelta();
  movement.lerp(temp.set(pointer.x, pointer.y * 0.2 * delta, 0), 0.2);
  group.position.x = MathUtils.lerp(
    group.position.x,
    pointer.x * 20 * delta,
    0.05
  );
  group.rotation.x = MathUtils.lerp(
    group.rotation.x,
    (pointer.y / 20) * delta,
    0.05
  );
  group.rotation.y = MathUtils.lerp(
    group.rotation.y,
    (-pointer.x / 2) * delta,
    0.05
  );
  meshes.slice(-2, undefined).forEach((mesh) => {
    mesh.material.uniforms.time.value += delta;

    mesh.material.uniforms.movement.value = movement;
    // mesh.material.uniforms.resolution.value = new Vector2(
    //     renderer.getSize(new Vector2()).width,
    //     renderer.getSize(new Vector2()).height
    //   );
  });

  raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), camera);
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
};
draw();
