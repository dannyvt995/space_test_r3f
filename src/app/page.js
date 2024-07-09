"use client"

import styles from "./page.module.css";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { Perf } from "r3f-perf";
import { OrbitControls, Stats , MeshReflectorMaterial} from "@react-three/drei";
import TestCar from "./TestCar";
import {Bloom,EffectComposer, DepthOfField, Vignette, Outline, wrapEffect } from '@react-three/postprocessing'
import { NoiseEffect } from 'postprocessing'
import EnvironmentCustom from "./EnvironmentCustom";

/* import { OutlinePass } from './outline' */
import InstancedModel from "./InstancedModel";
import { CustomOutlinePass } from "./CustomOutlinePass";
import { useEffect, useRef, useState } from "react";

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';

import FindSurfaces from "./FindSurfaces.js";

import { BlendFunction, Resizer, KernelSize } from 'postprocessing'
import { NoiseShader } from "./noiseShader";
import GroundMinor from "./GroundMinor";
import EnvSphere from "./EnvSphere";
import CustomEffectComposer from "./CustomEffectComposer";
extend({ EffectComposer, RenderPass, CustomOutlinePass, OutlinePass, RenderPixelatedPass, ShaderPass });
const Noise = wrapEffect(NoiseEffect)

const surfaceFinder = new FindSurfaces();
export default function Home() {

  return (
    <main className={styles.main}>
      <Canvas


        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth:  false
        }}
        camera={{ near: 0.1, far: 1000, position: [2, .7, 3.5], target: [0, 0, 0] }}>

        <OrbitControls enablePan={true} /* minPolarAngle={Math.PI / 3.2}  maxPolarAngle={Math.PI / 1} */ />
        <Perf />
        <Stats />
        <TestCar />
        <EnvSphere />
        {/*      <mesh position={[0,5,0]}>
          <boxGeometry args={[1,1,1]} />
          <meshBasicMaterial color={"red"}/>
        </mesh> */}

        <color attach="background" args={["black"]} />{/* 050505 */}
        <fog color={"white"} attach="fog" near={1} far={50} />
        {/*  <Environment preset="night" /> */}
       {/*   <axesHelper args={[5, 5, 5]} /> */}


        {/* <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} /> */}
        {/*  <EnvironmentCustom/> */}
        {/* <Environment preset="night" /> */}
      {/*   <GroundMinor/> */}
       {/*   
          <EffectComposerR3f/> */}
       <CustomEffectComposer/>
    
      </Canvas>
    </main>
  );
}


function EffectComposerR3f() {

  const { scene, camera, size, gl } = useThree();
  const composer = useRef();
  const outlinePass = useRef();
  const outlineRef = useRef();
  const meshRef = useRef();

  const [selected, select] = useState(true);
  useEffect(() => {

    outlinePass.current = new CustomOutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
    const params = {
      mode: { Mode: 1 },
      FXAA: true,
      outlineColor: 0xffffff,
      depthBias: 1,//uniforms.multiplierParameters.value.x
      depthMult: 0,//uniforms.multiplierParameters.value.y
      normalBias: 5.12,//uniforms.multiplierParameters.value.z
      normalMult: 0.7,//uniforms.multiplierParameters.value.z
      cameraNear: camera.near,
      cameraFar: camera.far,
    };

    outlinePass.current.fsQuad.material.uniforms.debugVisualize.value = params.mode.Mode;
    outlinePass.current.fsQuad.material.uniforms.multiplierParameters.value = new THREE.Vector4(
      params.depthBias,
      params.depthMult,
      params.normalBias,
      params.normalMult
    );
    // Add outline pass to composer
    //  composer.current.addPass(outlinePass.current);
    meshRef.current = scene.children[1].children[0]
 
    // Cleanup function
    return () => {
      //   composer.current.removePass(outlinePass.current);
    };
  }, [scene, camera, size]);


  return (
    <>
    
      <EffectComposer >
        
        <Bloom intensity={.5} luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
        <Noise opacity={0.01} intensity={5}/>
     
      </EffectComposer>
    </>

  )
}

function addSurfaceIdAttributeToMesh(scene, customOutline) {
  surfaceFinder.surfaceId = 0;

  scene.traverse((node) => {
    if (node.type == "Mesh" && node.name == "Pickit") {
      const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
      node.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colorsTypedArray, 4)
      );
    }
  });

  customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
}