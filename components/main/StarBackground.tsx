"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three"; // For THREE.Points type
// @ts-expect-error - maath/random doesn't have TypeScript definitions
import * as random from "maath/random/dist/maath-random.esm";

// Define props type using Record with unknown instead of any
type StarBackgroundProps = Record<string, unknown>;

const StarBackground = (props: StarBackgroundProps) => {
  const ref = useRef<THREE.Points | null>(null);

  // Ensure positions are valid numbers and length is correct
  const [sphere] = useState<Float32Array>(() => {
    const positions = random.inSphere(new Float32Array(5000 * 3), { radius: 1.2 });
    return positions.every((num: number) => !isNaN(num)) ? positions : new Float32Array(5000 * 3);
  });

  // Rotate the stars
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 z-[20]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
      <Preload all />
    </Canvas>
  </div>
);

export default StarsCanvas;