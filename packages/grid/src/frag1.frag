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

#define TAU 6.2831853

float rnd(vec2 p) {
  return fract(sin(dot(p, p.yx + vec2(1234, 2345))) * 345678.);
}

vec3 grid(vec2 uv) {
  vec3 col = vec3(0);

  float n = 1.2;
  vec2 g = abs(mod(uv, n) - .5 * n);

  col = mix(vec3(1), vec3(0), smoothstep(.08, .0, min(g.x, g.y)));
  col = min(col, mix(vec3(1), vec3(0), .125));

  return col;
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  uv *= 48.7;
  vec3 col = grid(uv);
  // col += vec3(1., 1., 1.);

  float d = length(vec2(log(length(uv)) - u_time * .5, atan(abs(uv.y), abs(uv.y)) / TAU));
  d = sin(d * dot(col, col)) - .05;
  d = abs(d);
  d = pow(.3 / d, .75);

  d = max(.0, d * mix(.75, 1., rnd(uv)));

  col *= mix(d, 1., 1. - min(1., smoothstep(.7, .8, u_time * .4)));

  col = mix(col, vec3(.01, .05, .052), .75);
  col = mix(col, vec3(0), 1. - min(1., smoothstep(.5, .8, u_time * .4)));

  gl_FragColor = vec4(col, 1);
}
