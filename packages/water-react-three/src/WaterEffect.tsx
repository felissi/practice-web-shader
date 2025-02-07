import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import { Texture, Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import { TouchTexture } from "./touch-texture";
import { useFrame } from "@react-three/fiber";

export class WaterEffectImpl extends Effect {
  _texture: Texture;
  constructor(options: { texture: Texture }) {
    super("WaterEffect", fragment, {
      uniforms: new Map([["uTexture", new Uniform(options.texture)]]),
    });

    this._texture = options.texture;
  }
}

const fragment = /* glsl */ `
uniform sampler2D uTexture;
#ifndef PI
  #define PI 3.141592653589
#endif

void mainUv(inout vec2 uv){
  vec4 tex = texture2D(uTexture, uv);
  float angle = -(tex.r * PI * 2. - PI);
  vec2 v = -(tex.rg * 2. - 1.);
  float intensity = tex.b;
  uv.xy += v * 0.2 * intensity;
}
`;

const _WaterEffect = forwardRef((options: { texture: Texture }, ref) => {
  const effect = new WaterEffectImpl(options);
  return (
    <primitive
      ref={ref}
      object={effect}
      dispose={null}
    />
  );
});
export const WaterEffect = forwardRef((_, ref) => {
  const touch = useMemo(() => new TouchTexture(), []);
  useFrame((state, delta) => {
    touch.addTouch({ x: state.pointer.x, y: state.pointer.y });
    touch.update(delta);
  });
  return (
    <_WaterEffect
      ref={ref}
      texture={touch.texture}
    />
  );
});
