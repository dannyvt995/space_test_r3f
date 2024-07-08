"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useGLTF, useTexture, Reflector, useCubeTexture, MeshReflectorMaterial } from "@react-three/drei";
import { Group, MeshStandardMaterial, Euler, MeshBasicMaterial, TextureLoader, EquirectangularReflectionMapping, Mesh } from "three";
import { useFrame } from "@react-three/fiber";

import { Outline } from '@react-three/postprocessing'
import { BlendFunction, Resizer, KernelSize } from 'postprocessing'
import GroundMinor from "./GroundMinor";


const materialsbANHxE = [
  new MeshBasicMaterial({ color: 0xfffff, side: 1, wireframe: false, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 0x00000, side: 1, wireframe: false, transparent: true, opacity: .1 }),
  new MeshBasicMaterial({ color: 0xd1982e, side: 1, wireframe: true, transparent: true, opacity: 0.35 }),
  new MeshBasicMaterial({ color: 'white', side: 1, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'green', side: 1, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'pink', side: 1, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'yellow', side: 1, wireframe: true, transparent: true, opacity: 0.5 }),
];

const BanhXe = ({ groupBanhXe }) => {
  console.log(groupBanhXe)
  if (groupBanhXe) {
    return (
      <group>
        {groupBanhXe.children.slice(1, 4).map((child, index) => (
          <mesh key={index} geometry={child.geometry} material={materialsbANHxE[index]} />
        ))}
      </group>
    )
  }

};
export default function TestCar() {
  const { scene: scene1New } = useGLTF("BUGATI_V2_F1.glb");
  // const { scene: scene2 } = useGLTF("buggati_face.glb");
  const matCar = useRef(null)


  const meshCar = scene1New.children[0].geometry;

  //meshCar.center()
  meshCar.renderOrder = 1

  const ListBanhXe = [
    scene1New.children[1],
    scene1New.children[2],
    scene1New.children[3],
    scene1New.children[4]
  ]


  const meshWireCar = scene1New.children[5].geometry


  //meshWireCar.center()
  meshWireCar.renderOrder = 2
  const maptexture = new TextureLoader().load('/PNG/env_t2.png');///PNG/env_t2.png
  maptexture.mapping = THREE.EquirectangularRefractionMapping;
  // maptexture.colorSpace = THREE.SRGBColorSpace;
  const matDf = new MeshBasicMaterial({ color: 'red', side: 2 })

  const mapbgtexture = new TextureLoader().load("/PNG/bg_env.png")
  const textureCube = useCubeTexture(['envx.png', 'env_n.png', 'env_n.png', 'env_n.png', 'env_n.png', 'env_n.png'], { path: '/PNG/' });
  console.log(textureCube)


  matCar.current = new MeshStandardMaterial({
    color: 0x00000,
    //flatShading:true,
    envMap: maptexture,
    envMapIntensity: 5.,
    //envMapRotation: new Euler( 0,-2.0,0, 'XYZ' ),
    //envMapRotation: new Euler( 0,1.0,0, 'XYZ' ),//env_f3_3
    metalness: 1,
    roughness: .1,
    side: 2
  });
  useFrame((state) => {

    //matCar.current.envMapRotation._y += Math.cos(state.clock.elapsedTime)*0.01
    // matCar.current.envMapRotation._x += Math.cos(state.clock.elapsedTime)*0.01
  })
  return (
    <>


      {/*  <directionalLight position={[5, 5, 5]}  intensity={.2} />  */}
      <group scale={0.42} visible={true} name="Carne">
        <mesh geometry={meshCar} material={matCar.current} />

      </group>
      <group position={[1.07, .35, 1.08]} scale={[.2 * 0.07, 1 * 0.07, .1 * 0.07]} visible={true}>
        <BanhXe groupBanhXe={ListBanhXe[0]} />
      </group>
      <group position={[1.1, .35, -2.2]} scale={[.2 * 0.07, 1 * 0.07, .1 * 0.07]}  >
        <BanhXe groupBanhXe={ListBanhXe[1]} />
      </group>
      {/*   <group visible={false}>
        <mesh>
          <sphereGeometry args={[5, 16, 32]} />
          <meshBasicMaterial fog={false} map={mapbgtexture} side={THREE.BackSide} />
        </mesh>
    
      </group> */}

     
      {/* check env */}
      {/*  <group visible={false}>
        <mesh material={matCar.current}>
          
          <sphereGeometry args={[8, 64, 62]} />
        </mesh>

      </group> */}
      {/* check env */}
      {/*     <group visible={false}>
        <mesh material={matCar.current}>
         
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
      </group> */}
      {/*   <group scale={0.42} visible={false} rotation={[0,0,0]}>
        <lineSegments geometry={meshWireCar}>
          <meshBasicMaterial
            color={0xffffff}
            wireframe={false}
            transparent={true}
            opacity={.5}
            depthTest={true}
            side={0}
            visible={true}
          />
        </lineSegments>

      </group> */}
    
   

    </>
  );
}
function OutlineCustom(meshRef) {
  return (
    <Outline
      selection={[meshRef]} // selection of objects that will be outlined
      selectionLayer={10} // selection layer
      blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
      patternTexture={null} // a pattern texture
      edgeStrength={2.5} // the edge strength
      pulseSpeed={0.0} // a pulse speed. A value of zero disables the pulse effect
      visibleEdgeColor={0xffffff} // the color of visible edges
      hiddenEdgeColor={0x22090a} // the color of hidden edges
      width={Resizer.AUTO_SIZE} // render width
      height={Resizer.AUTO_SIZE} // render height
      kernelSize={KernelSize.LARGE} // blur kernel size
      blur={false} // whether the outline should be blurred
      xRay={true} // indicates whether X-Ray outlines are enabled
    />
  )
}


useGLTF.preload("BUGATI_V2_F1.glb");
useGLTF.preload("buggati_face.glb");