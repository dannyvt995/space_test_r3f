"use client"
import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
export default function GroundMinor() {
    const meshRef = useRef()
    return (

        <>
            <ambientLight intensity={1} color={0xfffff} />
            <group position={[0., -.1, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} ref={meshRef}>
                    <circleGeometry args={[8, 32]} />
                    <MeshReflectorMaterial
                        resolution={window.innerWidth * .6}
                        mirror={1}
                    />
                </mesh>
            </group>
        </>


    )
}