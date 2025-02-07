import { Canvas } from "@react-three/fiber";
import { SheetProvider, editable as e } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { Text, useAspect, Helper, useHelper, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
  DepthOfField,
} from "@react-three/postprocessing";
import { useRef } from "react";
import { BoxHelper } from "three";
import { Flex, Box } from "@react-three/flex";

const sheet = getProject("demo").sheet("first");

export function Scene() {
  return (
    <Canvas camera={{ fov: 75, position: [5, 5, -5] }}>
      <SheetProvider sheet={sheet}>
        <ambientLight />
        <e.pointLight
          theatreKey="light"
          position={[10, 10, 10]}
        />
        <e.mesh theatreKey="cube">
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </e.mesh>
      </SheetProvider>
    </Canvas>
  );
}
function Title() {
  return (
    <group
      position={[0, 0, -10]}
      scale={10}
    >
      {/* <Text
        ref={title}
        fontSize={16}
        textAlign="center"
        anchorY="bottom"
      >
        TOKYO
      </Text>
      <Text
        fontSize={6}
        textAlign="center"
        anchorY="top"
      >
        MAY 15, 1932
        <Helper type={BoxHelper} />
      </Text> */}
      <Flex flexDirection="row">
        <Box>
          <Text fontSize={16}>T</Text>
        </Box>
        <Box>
          <Text fontSize={16}>O</Text>
        </Box>
      </Flex>
    </group>
  );
}

export function Opening() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30] }}
      orthographic
    >
      <OpeningEffect />
      {/* <ambientLight />
      <pointLight position={[10, 10, 10]} /> */}
      <color
        attach="background"
        args={["#000000"]}
      />
      <Title />
    </Canvas>
  );
}

function OpeningEffect() {
  return (
    <EffectComposer>
      <ChromaticAberration
        modulationOffset={500}
        radialModulation={false}
      />
      {/* <DepthOfField
        target={[0, 0, 0]}
        bokehScale={0}
        blur={500}
      /> */}
    </EffectComposer>
  );
}
