precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;
const float HALF_PI = PI * .5;

float wiggly(float cx, float cy, float amplitude, float frequency, float spread) {

  float w = sin(cx * amplitude * frequency * PI) * cos(cy * amplitude * frequency * PI) * spread;

  return w;
}

float shape(in vec2 p, float sides, float size) {

  float d = 0.0;
  vec2 st = p * 2. - 1.;

  // Number of sides of your shape
  float N = sides;

  // Angle and radius from the current pixel
  float a = atan(st.x, st.y) + PI;
  float r = (2. * PI) / (N);

  // Shaping function that modulate the distance
  d = cos(floor(.5 + a / r) * r - a) * length(st);

  return 1.0 - smoothstep(size, size + .1, d);
}

void coswarp(inout vec3 trip, float warpsScale) {

  trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (u_time * .25));
  trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (u_time * .25));
  trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (u_time * .25));

}

void uvRipple(inout vec2 uv, float intensity) {

  vec2 p = uv - .5;

  float cLength = length(p);

  uv = uv + (p / cLength) * cos(cLength * 15.0 - u_time * .5) * intensity;

} 

 // Classic Perlin 2D Noise
//  by Stefan Gustavson
//
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

vec2 rotate2D(vec2 _st, float _angle) {
  _st -= 0.5;
  _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
  _st += 0.5;
  return _st;
}

vec2 rotateTilePattern(vec2 _st) {

  float t = (u_time * .25) + length(_st - .5);

    //  Scale the coordinate system by 2x2
  _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
  float index = 0.0;
  index += step(1., mod(_st.x, 2.0));
  index += step(1., mod(_st.y, 2.0)) * 2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
  _st = fract(_st);

    // Rotate each cell according to the index
  if(index == 1.0) {
        //  Rotate cell 1 by 90 degrees
    _st = rotate2D(_st, PI * 0.5 + t);
  } else if(index == 2.0) {
        //  Rotate cell 2 by -90 degrees
    _st = rotate2D(_st, PI * -0.5 - t);
  } else if(index == 3.0) {
        //  Rotate cell 3 by 180 degrees
    _st = rotate2D(_st, PI);
  }

  return _st;
}

vec2 tile(vec2 st, float _zoom) {
  float vTime = u_time;
  st *= _zoom;

  return fract(st);
}

vec2 rotateUV(vec2 uv, vec2 pivot, float rotation) {
  mat2 rotation_matrix = mat2(vec2(sin(rotation), -cos(rotation)), vec2(cos(rotation), sin(rotation)));
  uv -= pivot;
  uv = uv * rotation_matrix;
  uv += pivot;
  return uv;
}

void coswarp2(inout vec2 trip, float warpsScale) {

  float vTime = u_time;
  trip.xy += warpsScale * .1 * cos(3. * trip.yx + (vTime * .25));
  trip.xy += warpsScale * .05 * cos(11. * trip.yx + (vTime * .25));
  trip.xy += warpsScale * .025 * cos(17. * trip.yx + (vTime * .25));

}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * .5) / u_resolution.yy + 0.5;

  // float vTime = u_time * .5;
  float t = length(uv - .5);

  // vec2 uv2 = uv;

  vec3 color2 = vec3(uv.x, uv.y, 1.);

  coswarp(color2, 2.);

  vec3 color = vec3(step(uv.x, uv.y));
  // float diagonalLine = step(uv.x, uv.y);

  if(color == vec3(0.)) {
    uv = fract(uv * (2. + sin(t)));
    color = vec3(step(uv.x, uv.y));
  }

  if(color == vec3(1.)) {
    uv = fract(uv * (2. + cos(t + color2.r)));
    color = vec3(step(uv.y, uv.x));
  }

  if(color == vec3(0.)) {
    uv = fract(uv * (12. + sin(t) + color2.g));
    color = vec3(step(uv.x, uv.y));
  }

  if(color == vec3(1.)) {
    uv = fract(uv * (12. + cos(t) + color2.b));
    color = vec3(step(uv.x, uv.y));
  }

  gl_FragColor = vec4(color, 1.0);
}
