import * as THREE from "three";
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

const geometry = new THREE.SphereGeometry(1, 32, 32);
const texture = new THREE.TextureLoader().load(textureImage);
const displacementMap = new THREE.TextureLoader().load(displacementMapUrl);
displacementMap.format = THREE.RGBFormat;
const material = new THREE.MeshBasicMaterial({
  // color: "red",
  color: 0xdddddd,
  map: texture,
  displacementMap,
  // displacementScale: 1.0,
  // displacementBias: 0.0,
  // wireframe: true,
  // reflectivity: 1.0,
});
// material.displacementMap = displacementMap;

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, -10);
scene.add(light);

const play = () => {
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(play);
};

play();
