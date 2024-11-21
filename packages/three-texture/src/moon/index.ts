import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import textureImage from "./lroc_color_poles_1k.jpg";
import displacementMapUrl from "./ldem_3_8bit.jpg";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const geometry = new THREE.SphereGeometry(1.0, 32, 32);
// const geometry = new THREE.PlaneGeometry(5, 5, 256, 256);
const texture = new THREE.TextureLoader().load(textureImage);
const displacementMap = new THREE.TextureLoader().load(displacementMapUrl);

const material = new THREE.MeshStandardMaterial({
  // color: "red",
  color: 0xdddddd,

  map: texture,
  displacementMap,
  displacementScale: 0.025,
  displacementBias: 0.0,
  // bumpMap: displacementMap,
  // wireframe: true,
  // reflectivity: 1.0,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 0, 5);
scene.add(light);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0.5, 0, -5);
scene.add(pointLight);

const control = new OrbitControls(camera, renderer.domElement);
const play = () => {
  // mesh.rotation.y += 0.01;
  // mesh.rotation.y = 50;
  control.update();
  renderer.render(scene, camera);

  requestAnimationFrame(play);
};

play();
