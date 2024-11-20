import * as THREE from "three";
import vertexShader from "./plane.vert?raw";
import fragmentShader from "./plane.frag?raw";

// const uniforms: Record<string, THREE.IUniform<any>> = {
//   time: { type: "f", value: 0 },
// };
// const planeShader = new THREE.RawShaderMaterial({
//   uniforms: {
//     time: { type: "f", value: 0 },
//   },
//   vertexShader,
//   fragmentShader,
//   transparent: true,
// });
function getRetrowaveShader() {
  return new THREE.RawShaderMaterial({
    uniforms: {
      time: { type: "f", value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });
}
// const planeGeometry = new THREE.PlaneGeometry(256, 256, 256, 256);

// const RetrowaveMaterial = () => {
//   return new THREE.Mesh(planeGeometry, planeShader);
// };

export class RetrowaveMesh extends THREE.Mesh {
  clock: THREE.Clock;
  shader: THREE.ShaderMaterial;
  uniforms: Record<string, THREE.IUniform<number>>;

  constructor() {
    const _shader = getRetrowaveShader();
    const _geometry = new THREE.PlaneGeometry(
      window.innerWidth / 8,
      256,
      1024,
      1024
    );

    super(_geometry, _shader);

    this.clock = new THREE.Clock();
    this.shader = _shader;
    this.geometry = _geometry;
    this.uniforms = _shader.uniforms;
  }
  render() {
    this.uniforms.time.value = this.clock.getElapsedTime();
  }
}
