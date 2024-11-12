
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

vec3 hue(float a) {
  return vec3(0) + step(a, .5);
}

vec3 grid(vec2 uv) {
  vec3 col = vec3(0);

  uv *= 98.7;

  float n = 1.2;
  vec2 g = abs(mod(uv, n) - .5 * n), id = floor(uv / n + .5);

  col = mix(vec3(1), vec3(0), S(.08, .0, min(g.x, g.y)));
  col = min(col, mix(vec3(1), hue(rnd(vec2(log(length(id * 100.)) - floor(10. * fract(u_time * 2.5)), atan(id.y, id.x)))), .65));

  return col * mix(.5, 1., rnd(id));
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 col = grid(uv);

  col = mix(col, vec3(.01, .05, .052) * 4., .125);
  // col = mix(col, vec3(1), S(.9f, 1.f, fade * fade));
  col = mix(col, vec3(1), 1. - min(1., S(.0, 1., u_time * .8)));

  gl_FragColor = vec4(col, 1);
}
