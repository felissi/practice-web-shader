import type { ImageProps } from "@react-three/drei";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { Texture, Vector2 } from "three";

const uniforms = {
  uMouse: new Vector2(0, 0),
  uZoom: 0,
  uZoomDelta: 0.2,
  uPlaneSize: null as unknown as Vector2,
  uImage: null as unknown as Texture,
  uImageSize: null as unknown as Vector2,
};
const PlaneMaterial = shaderMaterial(
  uniforms,
  /* glsl */ `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position.xyz, 1.);
    vUv = uv;
  }
  `,
  /* glsl */ `
  uniform float uZoom;
  uniform float uZoomDelta;
  uniform vec2 uMouse;
  uniform vec2 uPlaneSize;
  uniform sampler2D uImage;
  uniform vec2 uImageSize;

  varying vec2 vUv;

  vec2 withRatio(vec2 uv, vec2 canvasSize, vec2 textureSize){
    
    vec2 ratio = vec2(
        min((canvasSize.x / canvasSize.y) / (textureSize.x / textureSize.y), 1.0),
        min((canvasSize.y / canvasSize.x) / (textureSize.y / textureSize.x), 1.0)
      );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
  }
  vec3 greyScale(vec3 color){
      return vec3(color.r + color.g + color.b)/3.;
  }

  void main() {
      vec2 uv = vUv;
      uv -= 0.5;
      uv *= 1. - uZoomDelta * uZoom;
      uv += uZoomDelta * (uMouse-0.5) * 0.5 * uZoom;
      uv += 0.5;
      uv = withRatio(uv, uPlaneSize, uImageSize);
      vec3 tex = texture2D(uImage, uv).xyz;
      vec3 color = vec3(0.2 + uZoom * 0.5);
      color = mix(greyScale(tex)*0.5, tex, uZoom);
      gl_FragColor = vec4(color, 1.);
  }
  `
);
extend({ PlaneMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    planeMaterial: ThreeElements["shaderMaterial"] & typeof uniforms;
  }
}

function expDecay(a: number, b: number, decay: number, delta: number) {
  const t = Math.exp(-decay * delta);
  return a * t + b * (1 - t);
}

export function Plane(
  props: ImageProps & {
    scale?: [number, number];
  }
) {
  const [hovered, hover] = useState(false);
  const pointer = useThree((_) => _.pointer);
  const img = useTexture(props.url!);
  const [zoom, setZoom] = useState(0);
  useFrame((state, delta) => {
    setZoom(expDecay(zoom, hovered ? 1 : 0, 4, delta));
  });
  return (
    <>
      <mesh
        onPointerMove={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <planeGeometry args={props.scale} />
        <planeMaterial
          uMouse={pointer}
          uImage={img}
          uPlaneSize={new Vector2(...(props.scale as [number, number]))}
          uImageSize={new Vector2(img.image.width, img.image.height)}
          uZoom={zoom}
        />
      </mesh>
    </>
  );
}
