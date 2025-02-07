import { Canvas } from "@react-three/fiber";
import { Lights } from "./Lights";
import { useRef } from "react";

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], far: 1000 }}
      gl={{ alpha: false, depth: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#f5f5f5");
      }}
    >
      <Lights />
    </Canvas>
  );
}
function Content({ onReflow }) {
  return <></>;
}
