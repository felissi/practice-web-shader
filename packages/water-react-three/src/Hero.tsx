import { Flex, Box } from "@react-three/flex";
import { Plane } from "./Plane";

import image1 from "./assets/image-1.jpg?url";
import image2 from "./assets/image-2.jpg?url";
import image3 from "./assets/image-3.jpg?url";
import { Text, useAspect } from "@react-three/drei";

const images = [image1, image2, image3];

export function Hero() {
  const scale = useAspect(720, 1800, 0.2);
  return (
    <group>
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {images.map((image) => (
          <Box
            key={image}
            centerAnchor
          >
            <Plane
              url={image}
              scale={scale.slice(0, 2) as [number, number]}
            />
          </Box>
        ))}
      </Flex>
      <BeegText position={[0, 0, 0]} />
    </group>
  );
}

export function BeegText(props: JSX.IntrinsicElements["mesh"]) {
  return (
    <Text
      fontSize={20}
      color={0xe0e0e0}
    >
      WORD
    </Text>
  );
}
