import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import {
  EffectComposer,
  GlitchPass,
  RenderPass,
  OutputPass,
  AsciiEffect,
} from "three/examples/jsm/Addons.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "./sky";
import stepTexture from "./stone.jpg";
import stepFragmentShader from "./step.frag?raw";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xeeeeee, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.NoToneMapping;
// renderer.toneMappingExposure = 0;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 0, 256);
camera.lookAt(new THREE.Vector3(0, 0, -10));

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
// composer.addPass(new GlitchPass());

const outputPass = new OutputPass();
composer.addPass(outputPass);

const clock = new THREE.Clock();

const light = new THREE.PointLight(0xffffee, 100000);
light.position.set(-32, -32, 32);
scene.add(light);
// scene.add(new THREE.PointLightHelper(light));

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const control = new OrbitControls(camera, renderer.domElement);
control.enablePan = true;
control.screenSpacePanning = true;

const axis = new THREE.AxesHelper(1000);
scene.add(axis);

const stepMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  // transparent: true,
  // opacity: 1.0,
  metalness: 0.8,
  map: new THREE.TextureLoader().load(stepTexture),
  // fragmentShader: stepFragmentShader,
});
const stairStep = new THREE.InstancedMesh(
  new THREE.BoxGeometry(32, 6, 128),
  stepMaterial,
  500
);
stairStep.scale.setScalar(0.3);
stairStep.position.x = -50;
stairStep.position.y -= 500;
scene.add(stairStep);

const sky = new Sky();
sky.scale.setScalar(10000);
// scene.add(sky);

// Set instance transformations for a spiral staircase
const radius = 256;
const heightGap = 18;
const numOfStepInACircle = 32;
const angleGap = (2 * Math.PI) / numOfStepInACircle; // Adjust for tighter or looser spiral

// Set instance transformations
for (let i = 0; i < stairStep.count; i++) {
  const dummy = new THREE.Object3D();
  // angle against z-axis, theta.
  const angle = i * angleGap;

  // Transform each instance,
  // the order matters!
  dummy.translateZ(radius * Math.cos(angle));
  dummy.translateX(radius * Math.sin(angle));
  dummy.translateY(heightGap * i);
  dummy.rotation.y = angle;
  // Finish transformations
  dummy.updateMatrix();

  stairStep.setMatrixAt(i, dummy.matrix);
}

let rotated = clock.getElapsedTime();
const noise2D = createNoise2D();
const draw = () => {
  rotated -=
    (0.01 + Math.abs(noise2D(clock.getElapsedTime() * 10, 0)) * 0.01) *
    0.5 *
    Math.PI *
    2;
  stairStep.rotation.y = rotated;

  // renderer.render(scene, camera);
  composer.render();
  control.update();

  requestAnimationFrame(draw);
};
draw();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
