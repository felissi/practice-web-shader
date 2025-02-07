import { EffectComposer, Noise } from "@react-three/postprocessing";

import { WaterEffect } from "./WaterEffect";

export function Effect() {
  return (
    <EffectComposer>
      <WaterEffect />
      <Noise premultiply />
    </EffectComposer>
  );
}
