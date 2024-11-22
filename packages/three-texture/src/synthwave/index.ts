import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 128, 1024);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(1024, 1024),
  new THREE.MeshBasicMaterial({
    // map: new THREE.TextureLoader().load("./road.jpg"),
    color: 0xffffff,
    side: THREE.DoubleSide,
  })
);
road.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(road);

const control = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

function draw() {
  renderer.render(scene, camera);
  control.update();

  requestAnimationFrame(draw);
}
draw();
