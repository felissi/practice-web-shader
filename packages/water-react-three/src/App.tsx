import { Canvas } from "@react-three/fiber";
import { A11yAnnouncer } from "@react-three/a11y";

import "./App.css";
import { Hero } from "./Hero";
import { Effect } from "./Effect";

function App() {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 10000,
          position: [0, 0, 50],
        }}
      >
        <color
          attach="background"
          args={["#f0f0f0"]}
        />
        <ambientLight intensity={0.5} />
        <Hero />
        <Effect />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
}

export default App;
