import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./plane.vert?raw";
import fragmentShader from "./plane.frag?raw";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(0, 3, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const clock = new THREE.Clock();

const control = new OrbitControls(camera, renderer.domElement);
const axis = new THREE.AxesHelper(1);
scene.add(axis);

const planeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: false,
  side: THREE.DoubleSide,
  uniforms: THREE.UniformsUtils.merge([
    // THREE.UniformsLib.fog,
    // THREE.UniformsLib.lights,
  ]),
});
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 512, 512),
  planeMaterial
);
plane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(plane);

const light = new THREE.PointLight(0x0000ff, 1);
light.position.set(10, 10, 10);
light.lookAt(0, 0, 0);
scene.add(light);

const lighthelper = new THREE.PointLightHelper(light, 1);
scene.add(lighthelper);

const draw = () => {
  renderer.render(scene, camera);
  control.update();

  requestAnimationFrame(draw);
};

draw();
