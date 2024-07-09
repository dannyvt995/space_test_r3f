

import { useThree,useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { CustomOutlinePass } from "./CustomOutlinePass";
import { useEffect, useRef, useState } from "react";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import FindSurfaces from "./FindSurfaces.js";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { NoiseShader } from "./noiseShader";
import { Reflector } from './Reflector';
export default function CustomEffectComposer() {
    console.log("CustomEffectComposer")
    const composer = useRef();
    const composer2 = useRef();
    const mirror = useRef();
    const mirrorGeometry = useRef();
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
    const renderTarget1 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture: depthTexture,
        depthBuffer: true,
      }
    );
   const meshMinorRef = useRef()
    const noisePassRef = useRef()
    const camera2 = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 2000);
    const texture = useTexture("env.jpg")
    useEffect(() => {
  
       

      composer.current = new EffectComposer(gl, renderTarget);
 
      composer2.current = new EffectComposer(gl,renderTarget1);
      const renderPass = new RenderPass(scene, camera);
     
  
     
      camera2.position.y = -1
   
      const renderPass2 = new RenderPass(scene, camera2);
      renderPass2.renderToScreen = false;
      composer2.current.addPass(renderPass2);
   
      composer.current.addPass(renderPass);
      const params = {
        mode: { Mode: 1 },
        FXAA: true,
        outlineColor: 0xffffff,
        depthBias: 1,//uniforms.multiplierParameters.value.x
        depthMult: 1,//uniforms.multiplierParameters.value.y
        normalBias: 5.12,//uniforms.multiplierParameters.value.z
        normalMult: 0.4,//uniforms.multiplierParameters.value.z
        cameraNear: camera.near,
        cameraFar: camera.far,
      };
  
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), .5, 0, 0.0);
      const effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
  
      const outlinePass = new CustomOutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
      outlinePass.fsQuad.material.uniforms.debugVisualize.value = params.mode.Mode //Outlines V1
      outlinePass.fsQuad.material.uniforms.multiplierParameters.value = new THREE.Vector4(
        params.depthBias,
        params.depthMult,
        params.normalBias,
        params.normalMult
      )
  
      // addSurfaceIdAttributeToMesh(scene,outlinePass);
     
  
  
      // Add Noise Shader Pass
      noisePassRef.current = new ShaderPass(NoiseShader);
      noisePassRef.current.uniforms["amount"].value = 0.01; // Adjust the noise amount as needed
      noisePassRef.current.needsSwap = true
  
  
  
      outlinePass.renderToScreen = false;
  //  composer.current.addPass(outlinePass);
   //  composer2.current.addPass(outlinePass);
     composer.current.addPass(effectFXAA);

    //  noisePassRef.current.renderToScreen = false;

      // composer2.current.addPass(noisePass);
     // bloomPass.renderToScreen =true ;
    
     const outputPass = new OutputPass()
     //
 




    

      composer.current.addPass(noisePassRef.current)
      composer.current.addPass(bloomPass);
       //composer2.current.addPass(bloomPass);
      //  effectFXAA.renderToScreen = true;

   
  
      
   
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
        composer2.current.dispose();
      };
    }, [scene, camera, gl, size]);
  

    useEffect(() => {
              
    //  mirrorGeometry.current = new THREE.PlaneGeometry( 10, 10,200,200 );
      mirrorGeometry.current =  new THREE.RingGeometry( 0, 20, 200,200 ); 
      mirror.current = new Reflector( mirrorGeometry.current, {
        clipBias: 0.01,
        textureWidth: window.innerWidth * .72,
        textureHeight: window.innerHeight  * .72,
        color: 0x777777,
        
        } ,composer.current);
   
        mirror.current.position.y = .01
        mirror.current.rotateX(  - Math.PI / 2 );
  
        scene.add(mirror.current)
    },[scene])
    useFrame((state) => {
      if (composer.current) {
        if(mirror.current){
         mirror.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
     
        }
      composer.current.render();
    
   meshRef.current.material.uniforms.uComposer.value = composer.current.renderTarget1.textures[0] 
      }
    }, 1);
    return (
      <>
      <ambientLight intensity={1} color={0xffffff} />
    {/*   <group position={[0., -.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} ref={meshMinorRef}>
              <circleGeometry args={[8, 32]} />
              <MeshReflectorMaterial
                  resolution={window.innerWidth * .6}
                  mirror={1}
               
              />
          </mesh>
      </group> */}
  </>
    )
  }