import * as THREE from "three";
import cubeTexture from "./assets/UV_checker_Map_byValle.jpg";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(cubeTexture);

const geometry = new THREE.BoxGeometry(5, 5);
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

function render() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // camera.aspect = window.innerWidth / window.innerHeight;
});
