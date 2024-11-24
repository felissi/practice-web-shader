import * as THREE from "three";
import {
  EffectComposer,
  OrbitControls,
  OutputPass,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const control = new OrbitControls(camera, renderer.domElement);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 })
);
sun.position.set(0, 0, 0);
scene.add(sun);
const light = new THREE.PointLight(0xffffff, 1000);
light.position.set(0, 0, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const earthOrbit = new THREE.Group();

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x0000dd })
);
earth.position.x = 12;
earthOrbit.add(earth);
scene.add(earthOrbit);

const moonOrbit = new THREE.Group();
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xeeeeee })
);
moonOrbit.add(moon);
moonOrbit.position.x = 12;
moon.position.x = 4;
earthOrbit.add(moonOrbit);

const axis = new THREE.AxesHelper(1000);
scene.add(axis);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(
  new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.2,
    0.2,
    0.1
  )
);
composer.addPass(new OutputPass());
composer.render();

function draw() {
  earthOrbit.rotation.y += 0.01;
  moonOrbit.rotation.y += 0.01;

  composer.render();

  control.update();
  requestAnimationFrame(draw);
}
draw();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  control.update();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
