import type { ImageProps } from "@react-three/drei";
import {
  Image,
  MeshPortalMaterial,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import { useMemo, useState } from "react";
import { Uniform, Vector2 } from "three";
import { useThree, extend } from "@react-three/fiber";
import { easing } from "maath";

const uniforms = {
  uMouse: new Uniform(new Vector2(0, 0)),
  uZoom: new Uniform(0),
  uZoomDelta: new Uniform(0.2),
  uPlaneSize: null,
  uImage: null,
  uImageSize: null,
};
const PlaneMaterial = shaderMaterial(
  uniforms,
  /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec3 pos = position.xyz;
    gl_Position = projectionMatrix * modelMatrix * vec4(pos, 1.);
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
    uv *= 1.- uZoomDelta * uZoom;
    uv += uZoomDelta * (uMouse-0.5) * 0.5 * uZoom;
    uv += 0.5;
    uv = withRatio(uv, uPlaneSize, uImageSize);
    vec3 tex = texture2D(uImage, uv).xyz;
  vec3 color = vec3(0.2 + uZoom * 0.5);
  color = mix(greyScale(tex)*0.5, tex, uZoom);
  gl_FragColor = vec4(color,1.);
}
  `
);
extend({ PlaneMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    PlaneMaterial: typeof uniforms;
  }
}

export function Plane(
  props: ImageProps & {
    scale?: [number, number];
  }
) {
  const [hovered, hover] = useState(false);
  const pointer = useThree((_) => _.pointer);
  // const zoom = useMemo(()=>{
  // return eas
  // }, [hovered])
  const img = useTexture(props.url!);
  return (
    // <mesh
    //   onPointerMove={() => hover(true)}
    //   onPointerOut={() => hover(false)}
    // >
    //   <planeGeometry args={props.scale} />
    //   <MeshPortalMaterial sca={hovered ? 1.1 : 1}>
    //     <Image
    //       position={hovered ? [3, 3, -3] : [0, 0, 0]}
    //       url={props.url}
    //       scale={props.scale}
    //       grayscale={hovered ? 1 : 0}
    //     />
    //   </MeshPortalMaterial>
    // </mesh>
    <mesh>
      <planeGeometry scale={props.scale} />
      <planeMaterial
        uMouse={pointer}
        uImage={img}
        uPlaneSize={new Vector2(...props.scale)}
        uImageSize={new Vector2(1200, 1800)}
      />
    </mesh>
  );
}
