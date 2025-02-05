import { useRef, useState } from "react";
import type { GroupProps } from "@react-three/fiber";
import { Canvas, extend, useFrame } from "@react-three/fiber";

import "./App.css";
import {
  ScrollControls,
  Text,
  Gltf,
  MeshPortalMaterial,
  PortalMaterialType,
  CameraControls,
  useCursor,
} from "@react-three/drei";
import { geometry, easing } from "maath";
import {} from "three";

import pickleGlb from "./assets/pickles_3d_version_of_hyuna_lees_illustration-transformed.glb?url";
import * as THREE from "three";

extend(geometry);
declare module "@react-three/fiber" {
  interface ThreeElements {
    roundedPlaneGeometry: {
      args: any;
    };
  }
}

function App() {
  return (
    <>
      <Canvas
        flat
        camera={{ fov: 75, position: [0, 0, 20] }}
        style={{ height: "100dvh" }}
      >
        <ScrollControls infinite>
          <color
            attach="background"
            args={["#f0f0f0"]}
          />
          <Frame
            id="01"
            name="tea"
            author="Omar"
            rotation={[0, 0.5, 0]}
            bg="#e4cdac"
            scale={8}
          >
            <Gltf
              src={pickleGlb}
              scale={8}
              position={[0, -0.7, -2]}
            />
          </Frame>
          {/* <CameraControls makeDefault /> */}
        </ScrollControls>
      </Canvas>
    </>
  );
}

export default App;

function Frame(
  _props: {
    id: string;
    name: string;
    author: string;
    bg?: any;
    children?: React.ReactNode;
  } & GroupProps & {
      width?: number;
      height?: number;
      radius?: number;
      segments?: number;
    }
) {
  const {
    id,
    name,
    width = 1,
    height = 1.618,
    radius = 0.1,
    segments,
    bg,
    children,
    ...props
  } = _props;
  const portal = useRef<PortalMaterialType>();
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame((state, delta) => {
    easing.damp(portal.current!, "blend", hovered ? 1 : 0, 0.1, delta);
  });
  return (
    <group {...props}>
      <Text
        fontSize={0.3}
        anchorY="top"
        lineHeight={0.8}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <mesh
        name={id}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, radius]} />
        <MeshPortalMaterial
          ref={portal}
          side={THREE.DoubleSide}
        >
          <color
            attach="background"
            args={bg && [bg]}
          />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
