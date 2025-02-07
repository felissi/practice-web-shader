export function Lights() {
  return (
    <>
      <pointLight
        position={[-10, -10, -10]}
        intensity={1}
      />
      <ambientLight intensity={0.4} />
      <spotLight
        castShadow
        angle={0.3}
        penumbra={1}
        position={[0, 10, 20]}
        intensity={5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}
