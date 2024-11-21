// #ifdef GL_ES
// precision mediump float;
// #endif

// // attribute vec3 position;

// // uniform mat4 projectionMatrix;
// // uniform mat4 modelViewMatrix;

// varying vec3 vNormal;
// varying vec3 vViewPosition;
// varying vec3 vCameraPosition;

// float random(in vec2 st) {
//   return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
//     43758.5453123);
// }

// // Based on Morgan McGuire @morgan3d
// // https://www.shadertoy.com/view/4dS3Wd
// float noise(in vec2 st) {
//   vec2 i = floor(st);
//   vec2 f = fract(st);

//     // Four corners in 2D of a tile
//   float a = random(i);
//   float b = random(i + vec2(1.0, 0.0));
//   float c = random(i + vec2(0.0, 1.0));
//   float d = random(i + vec2(1.0, 1.0));

//   vec2 u = f * f * (3.0 - 2.0 * f);

//   return mix(a, b, u.x) +
//     (c - a) * u.y * (1.0 - u.x) +
//     (d - b) * u.x * u.y;
// }

// #define OCTAVES 6
// float fbm(in vec2 st) {
//     // Initial values
//   float value = 0.0;
//   float amplitud = .5;
//   float frequency = 0.;
//     //
//     // Loop of octaves
//   for(int i = 0; i < OCTAVES; i++) {
//     value += amplitud * noise(st);
//     st *= 2.;
//     amplitud *= .5;
//   }
//   return value;
// }

// void main(void) {
//   vec3 pos = position;
//   pos.z += fbm(pos.xy);
//   // pos.z += 1.;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

//   vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//   vNormal = normal;
//   vViewPosition = mvPosition.xyz;
//   vCameraPosition = cameraPosition;
// }

#define TOON

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

  vViewPosition = -mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
