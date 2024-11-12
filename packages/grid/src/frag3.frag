  /*********
  * made by Matthias Hurrle (@atzedent)
  */

  #ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
  #else
precision mediump float;
  #endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float fade;

  #define S smoothstep

float rnd(vec2 p) {
  return fract(sin(dot(p, p.yx + vec2(1234, 2345))) * 345678.);
}

vec3 grid(vec2 uv) {
  vec2 p = uv;
  vec3 col = vec3(0);

  uv *= 28.7;

  float n = 1.2, distort = mix(.5, 1., rnd(p));
  vec2 g = abs(mod(uv, n) - .5 * n), id = floor(uv / n + .5);

  col = mix(vec3(1), vec3(0), S(.08 * distort, .0, min(g.x, g.y)));

  return col;
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 col = grid(uv);

  // col = mix(col, vec3(0), S(.9f, 1.f, fade * fade));
  col = mix(col, vec3(1), 1. - min(1., S(.0, .5, u_time * .4)));

  gl_FragColor = vec4(col, 1);
}
