import {
  DepthOfFieldEffect,
  EffectComposer,
  EffectPass,
  MaskFunction,
  RenderPass,
  VignetteEffect,
} from "postprocessing";
import {
  Clock,
  Color,
  Group,
  MathUtils,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import bearUrl from "./assets/bear.png";
import bgUrl from "./assets/bg.jpg";
import groundUrl from "./assets/ground.png";
import leaves1Url from "./assets/leaves1.png";
import leaves2Url from "./assets/leaves2.png";
import starsUrl from "./assets/stars.png";
import { LayerMaterial } from "./layerMaterial";
import "./style.css";

const canvas = document.querySelector("#scene")! as HTMLCanvasElement;

const clock = new Clock();
const scene = new Scene();

const renderer = new WebGLRenderer({ canvas, antialias: false, stencil: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(2);
renderer.setClearColor(new Color(0, 0, 0), 0);
const usePointer = () => {
  const _ = { x: 0, y: 0 };
  const _buffer = new Vector2();
  window.addEventListener(
    "mousemove",
    (event) => {
      _.x = (event.clientX / renderer.getSize(_buffer).width) * 2 - 1;
      _.y = -(event.clientY / renderer.getSize(_buffer).height) * 2 + 1;
    },
    { passive: true }
  );
  return _;
};
// ####################
const camera = new OrthographicCamera(
  -window.innerWidth / 2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  -window.innerHeight / 2,
  50,
  300
);
camera.zoom = 5;
camera.position.set(0, 0, 200);
camera.updateProjectionMatrix();
// ####################
const pointer = usePointer();

const getAspect = (
  width: number,
  height: number,
  factor: number = 1,
  /** camera zoom */
  zoom = 1
): [number, number, number] => {
  const v = new Vector2(window.innerWidth, window.innerHeight);
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
  return [(adaptedWidth * factor) / zoom, (adaptedHeight * factor) / zoom, 1];
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
textures.forEach((_) => (_.colorSpace = SRGBColorSpace));

const scaleN = () => getAspect(1600, 1000, 1.05, camera.zoom);
const scaleW = () => getAspect(2200, 1000, 1.05, camera.zoom);

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
    x: -20,
    y: -20,
    z: 49,
    factor: 0.04,
    scaleFactor: 1.3,
    wiggle: 1,
    scale: scaleW,
  },
];
const meshes = layers.map(
  ({ scale, texture, factor = 0, scaleFactor = 1, wiggle = 0, x, y, z }, i) => {
    const geometry = new PlaneGeometry(
      ...[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]
    );
    const material = LayerMaterial();
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(...scale());
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

  camera.left = -window.innerWidth / 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = -window.innerHeight / 2;
  camera.updateProjectionMatrix();
});

const composer = new EffectComposer(renderer, { multisampling: 0 });

composer.addPass(new RenderPass(scene, camera));
const depthOfField = new DepthOfFieldEffect(camera, {
  bokehScale: 8,
  focalLength: 0.1,
  width: 1024,
});
depthOfField.maskFunction = MaskFunction.MULTIPLY_RGB_SET_ALPHA;
depthOfField.target = new Vector3(0, 0, 30);
composer.addPass(new EffectPass(camera));
composer.addPass(new EffectPass(camera, depthOfField));
composer.addPass(new EffectPass(camera, new VignetteEffect()));

const draw = () => {
  const delta = clock.getDelta();

  const lerpDeltaCorrect = (x: number, delta: number) => 1 - x ** delta;

  movement.lerp(
    temp.set(pointer.x, pointer.y, 0),
    lerpDeltaCorrect(0.2, delta)
  );
  group.position.x = MathUtils.lerp(
    group.position.x,
    pointer.x * 20,
    lerpDeltaCorrect(0.05, delta)
  );
  group.rotation.x = MathUtils.lerp(
    group.rotation.x,
    pointer.y / 20,
    lerpDeltaCorrect(0.05, delta)
  );
  group.rotation.y = MathUtils.lerp(
    group.rotation.y,
    -pointer.x / 2,
    lerpDeltaCorrect(0.05, delta)
  );

  meshes.forEach((mesh, i) => {
    mesh.material.uniforms.time.value += delta;
    mesh.material.uniforms.movement.value = movement;
    mesh.scale.set(...layers[i].scale());
  });

  composer.render(delta);
  requestAnimationFrame(draw);
};
draw();
