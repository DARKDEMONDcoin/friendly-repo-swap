import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Form() {
  const mesh = useRef<THREE.Mesh>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useFrame((_, delta) => {
    if (!mesh.current || reduced) return;
    const dt = Math.min(delta, 0.05);
    mesh.current.rotation.x += dt * 0.08;
    mesh.current.rotation.y += dt * 0.12;
  });
  return (
    <mesh ref={mesh} rotation={[0.4, 0.25, 0]}>
      <torusKnotGeometry args={[1.35, 0.42, 96, 12, 2, 3]} />
      <meshStandardMaterial color="#C1663A" roughness={0.58} metalness={0.18} transparent opacity={0.5} />
    </mesh>
  );
}

export default function HeroObject3D() {
  return (
    <div className="hero-object-3d" aria-hidden>
      <Canvas dpr={[1, 1.35]} frameloop="always" camera={{ position: [0, 0, 5.6], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={2.2} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#F4D590" />
        <directionalLight position={[-4, -2, 2]} intensity={1.6} color="#5B7553" />
        <Form />
      </Canvas>
    </div>
  );
}