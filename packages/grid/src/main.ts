import * as THREE from "three";
import vertexShaderCode from "./vert.vert?raw";
import fragmentShaderCode from "./frag1.frag?raw";

const clock = new THREE.Clock();
const camera = new THREE.Camera();
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(
  renderer.domElement.width,
  renderer.domElement.height
);

const uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
};

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShaderCode,
  fragmentShader: fragmentShaderCode,
  uniforms,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const setViewportSize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(
    renderer.domElement.width,
    renderer.domElement.height
  );
};
setViewportSize();
window.addEventListener("resize", setViewportSize);

const render = () => {
  uniforms.u_time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(() => {
  render();
});
