"use client"

import styles from "./page.module.css";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { Perf } from "r3f-perf";
import { OrbitControls, Stats, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import TestCar from "./TestCar";
import {Bloom, DepthOfField, Vignette, Outline, wrapEffect } from '@react-three/postprocessing'
import { NoiseEffect } from 'postprocessing'
import EnvironmentCustom from "./EnvironmentCustom";
import { Vector2 } from "three";
/* import { OutlinePass } from './outline' */
import InstancedModel from "./InstancedModel";
import { CustomOutlinePass } from "./CustomOutlinePass";
import { useEffect, useRef, useState } from "react";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import FindSurfaces from "./FindSurfaces.js";

import { BlendFunction, Resizer, KernelSize } from 'postprocessing'
import { NoiseShader } from "./noiseShader";
import GroundMinor from "./GroundMinor";
import EnvSphere from "./EnvSphere";
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
          depth: false
        }}
        camera={{ near: 0.1, far: 1000, position: [2, .7, 3.5], target: [0, 0, 0] }}>

        <OrbitControls enablePan={true} minPolarAngle={Math.PI / 2.7} /*  maxPolarAngle={Math.PI / -2.7} */ />
        <Perf />
        <Stats />
        <TestCar />
        <EnvSphere />
        {/*      <mesh position={[0,5,0]}>
          <boxGeometry args={[1,1,1]} />
          <meshBasicMaterial color={"red"}/>
        </mesh> */}

        <color attach="background" args={["#050505"]} />{/* 050505 */}
        <fog color={0x050505} attach="fog" near={1} far={5} />
        {/*  <Environment preset="night" /> */}
        {/*  <axesHelper args={[5, 5, 5]} /> */}


        {/* <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} /> */}
        {/*  <EnvironmentCustom/> */}
        {/* <Environment preset="night" /> */}
       {/*    <EffectComposerR3f/> */}
        <CustomEffectComposer />
          <GroundMinor/>
      </Canvas>
    </main>
  );
}
function CustomEffectComposer() {
  console.log("CustomEffectComposer")
  const composer = useRef();
  const composer2 = useRef();
  const { scene, camera, gl, size } = useThree();
  const meshRef = useRef()
  const depthTexture = new THREE.DepthTexture();
  const renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      depthTexture: depthTexture,
      depthBuffer: true,
    }
  );

  useEffect(() => {


    composer.current = new EffectComposer(gl, renderTarget);
    composer2.current = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);

    const camera2 = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 2000);
    camera2.position.y = -3
    camera2.lookAt(0, 0, 0)
    const renderPass2 = new RenderPass(scene, camera2);

    composer.current.addPass(renderPass);
    const params = {
      mode: { Mode: 1 },
      FXAA: false,
      outlineColor: 0xffffff,
      depthBias: 1,//uniforms.multiplierParameters.value.x
      depthMult: 0,//uniforms.multiplierParameters.value.y
      normalBias: 5.12,//uniforms.multiplierParameters.value.z
      normalMult: 0.4,//uniforms.multiplierParameters.value.z
      cameraNear: camera.near,
      cameraFar: camera.far,
    };

    const bloomPass = new UnrealBloomPass(new Vector2(size.width, size.height), 1, 0, 0.0);
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );


    const outlinePass = new CustomOutlinePass(new Vector2(size.width, size.height), scene, camera);
    outlinePass.fsQuad.material.uniforms.debugVisualize.value = params.mode.Mode //Outlines V1
    outlinePass.fsQuad.material.uniforms.multiplierParameters.value = new THREE.Vector4(
      params.depthBias,
      params.depthMult,
      params.normalBias,
      params.normalMult
    )

    // addSurfaceIdAttributeToMesh(scene,outlinePass);




    // Add Noise Shader Pass
    const noisePass = new ShaderPass(NoiseShader);
    noisePass.uniforms["amount"].value = 0.01; // Adjust the noise amount as needed

    // 
    //

    const outputPass = new OutputPass()


    outlinePass.renderToScreen = false;
    composer.current.addPass(outlinePass);
    //  effectFXAA.renderToScreen = false;
    //  composer.current.addPass(effectFXAA); 
    noisePass.renderToScreen = false;
    composer.current.addPass(noisePass);

    bloomPass.renderToScreen = true;
    composer.current.addPass(bloomPass);


    meshRef.current = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 4),
      new THREE.ShaderMaterial({
        side: 2,
        uniforms: {
          uComposer: { value: null },
          uFlipTex:{value:null}
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }
    `,
        fragmentShader: `
       varying vec2 vUv;
       uniform sampler2D uComposer;
       uniform bool uFlipTex;
       void main() {
       vec2 uv =vec2(0.);

       if(uFlipTex == true) {
          uv = vec2(1. - vUv.x ,vUv.y);
       }else{
          uv = vec2(vUv.x ,vUv.y);
       }
       vec4 rls = texture2D(uComposer,uv);
        gl_FragColor = rls;
       }
    
    `
      })
    )
    meshRef.current.position.x = -5
    meshRef.current.position.z = -5
    meshRef.current.position.y = 1
    meshRef.current.lookAt(0, 1, 0)
 
    const meshC = meshRef.current.clone()
    meshC.position.x = 2
    meshC.position.z = -7
    meshC.lookAt(0, 0, 0)
    meshC.material.uniforms.uFlipTex.value = true
    meshRef.current.material.uniforms.uFlipTex.value = false
    scene.add(meshRef.current, meshC)

    return () => {

      composer.current.dispose();
    };
  }, [scene, camera, gl, size]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
      meshRef.current.material.uniforms.uComposer.value = composer.current.renderTarget1.textures[0]

    }
  }, 1);

  return null;
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

      <EffectComposer ref={composer} args={[gl]} autoClear={false}>
        <Noise opacity={0.01} />
        <Bloom intensity={.2} luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
         {meshRef.current && (
        <Outline
     xRay
     selection={[meshRef]}
     edgeStrength={2.5}
     pulseSpeed={0.0}
     visibleEdgeColor={0xffffff}
     hiddenEdgeColor={0x22090a}
     ref={outlineRef}
  />
       )}
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