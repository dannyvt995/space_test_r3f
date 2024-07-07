"use client"

import styles from "./page.module.css";
import { Canvas } from "@react-three/fiber";

import { Perf } from "r3f-perf";
import { OrbitControls, Stats,ContactShadows,Environment } from "@react-three/drei";
import TestCar from "./TestCar";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { Effects } from "./Effects";
import EnvironmentCustom from "./EnvironmentCustom";

export default function Home() {
  return (
    <main className={styles.main}>
      <Canvas 
       
       
       gl={{
        powerPreference: "high-performance",
         alpha: false,
         antialias: false,
         stencil: false,
         depth: false
       }}
      camera={{ near: 0.1, far: 1000 ,position:[2,.7,3.5],target:[0,0,0] }}>
        
        <OrbitControls  enablePan={true} minPolarAngle={Math.PI / 4}/>
        <Perf />
        <Stats />
        <TestCar />
      {/*   <axesHelper args={[5, 5, 5]} /> */}
        <color attach="background" args={["#050505"]} />
        <fog color="#09112d" attach="fog" near={1} far={7} />
        {/* <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} /> */}
       {/*  <EnvironmentCustom/> */}
       {/* <Environment preset="night" /> */}
       
        <EffectComposer>
         
          {/* <DepthOfField
            focusDistance={0} // where to focus
            focalLength={0.05} // focal length
            bokehScale={2} // bokeh size
          /> */}
           <Noise opacity={0.02} />
           <Bloom intensity={.2} luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
        </EffectComposer>
        {/* <Effects/> */}
      </Canvas>
    </main>
  );
}
