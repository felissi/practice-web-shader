import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RetrowaveMesh } from "./plane";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee, 1.0);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(0, 16, 128);
camera.lookAt(new THREE.Vector3(0, 28, 0));

const clock = new THREE.Clock();

const control = new OrbitControls(camera, renderer.domElement);

// ==================

const plane = new RetrowaveMesh();
scene.add(plane);

const draw = () => {
  renderer.render(scene, camera);
  console.log(
    `🚀 // DEBUG 🍔  ~ file: index.ts:33 ~ `,
    renderer.getSize(new THREE.Vector2()).height / 2
  );

  plane.position.y = -20;
  plane.render();

  control.update();

  requestAnimationFrame(draw);
};

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

draw();
