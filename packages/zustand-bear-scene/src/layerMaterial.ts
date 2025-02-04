import { ShaderMaterial, Vector2, Vector3 } from "three";

export const LayerMaterial = () =>
  new ShaderMaterial({
    vertexShader: ` uniform float time;
    uniform vec2 resolution;
    uniform float wiggle;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main()	{
      vUv = uv;
      vec3 transformed = vec3(position);
      if (wiggle > 0.) {
        float theta = sin(time + position.y) / 2.0 * wiggle;
        float c = cos(theta);
        float s = sin(theta);
        mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
        transformed = transformed * m;
        vNormal = vNormal * m;
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
    }`,
    fragmentShader: ` uniform float time;
    uniform vec2 resolution;
    uniform float factor;
    uniform float scale;
    uniform vec3 movement;
    uniform sampler2D textr;
    varying vec2 vUv;
    void main()	{
      vec2 uv = vUv / scale + movement.xy * factor;
      vec4 color = texture2D(textr, uv);
      if (color.a < 0.1) discard;
      gl_FragColor = vec4(color.rgb, .1);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
    uniforms: {
      time: { value: 0 },
      wiggle: { value: 0 },
      factor: { value: 0 },
      scale: { value: 1 },
      movement: { value: new Vector3(0, 0, 0) },
      textr: { value: null },
      // resolution: { type: "v2", value: new Vector2() },
    },
  });
