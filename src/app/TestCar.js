"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useGLTF, useTexture, Reflector, useCubeTexture, MeshReflectorMaterial } from "@react-three/drei";
import { Group, MeshStandardMaterial, Euler, MeshBasicMaterial, TextureLoader, EquirectangularReflectionMapping, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
const materialsbANHxE = [
  new MeshBasicMaterial({ color: 0xfffff, side: 2, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 0x08122f, side: 2, wireframe: true, transparent: true, opacity: 1. }),
  new MeshBasicMaterial({ color: 0xd1982e, side: 2, wireframe: true, transparent: true, opacity: 0.35 }),
  new MeshBasicMaterial({ color: 'white', side: 2, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'green', side: 2, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'pink', side: 2, wireframe: true, transparent: true, opacity: 0.5 }),
  new MeshBasicMaterial({ color: 'yellow', side: 2, wireframe: true, transparent: true, opacity: 0.5 }),
];

const BanhXe = ({ groupBanhXe }) => {
  console.log(groupBanhXe)
  if(groupBanhXe) {
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
  const { scene: scene2 } = useGLTF("buggati_face.glb");
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
      <group scale={0.42} visible={true}>
        <mesh geometry={meshCar} material={matCar.current} />

      </group>
      <group position={[1.07,.35,1.08]} scale={[.2 * 0.07, 1 * 0.07, .1 * 0.07]} visible={true}>
        <BanhXe groupBanhXe={ListBanhXe[0]} />

      </group>
      <group visible={false}>
      <mesh>
        <sphereGeometry args={[5, 16, 32]} />
        <meshBasicMaterial fog={false} map={mapbgtexture} side={THREE.BackSide} />
      </mesh>
    
      </group>
      
      <group >
        <mesh>
          <sphereGeometry args={[8,16,16]}/>
          <meshBasicMaterial color={0x00000} colorWrite={true} side={THREE.BackSide}/>
        </mesh>
      </group>
      {/* check env */}
      <group visible={false}>
        <mesh material={matCar.current}>
          {/*     <boxGeometry args={[9,9,9]}/> */}
          <sphereGeometry args={[8, 64, 62]} />
        </mesh>

      </group>
         {/* check env */}
      <group visible={false}>
        <mesh material={matCar.current}>
          {/* <boxGeometry args={[2,2,2]}/> */}
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
      </group>
      <group scale={0.42} visible={true} rotation={[0,0,0]}>
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

      </group>
       <ambientLight intensity={0.5} color={0x768aab}/>
        <group position={[0.,-.1,0]}>
          <Ground/>
        </group>
    </>
  );
}
function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    
  /*   <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={2} mixBlur={1} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0"  metalness={0.2} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
     
    </Reflector> */
    <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
  <planeGeometry args={[50,50]}/>
  <MeshReflectorMaterial
 /*  roughnessMap={floor} normalMap={normal} */
  
    //blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
    //mixBlur={0} // How much blur mixes with surface roughness (default = 1)
    // mixStrength={1} // Strength of the reflections
    // mixContrast={1} // Contrast of the reflections
    resolution={512} // Off-buffer resolution, lower=faster, higher=better quality, slower
    mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
    //depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
    // minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
    // maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
    // depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
    // distortion={0.} // Amount of distortion based on the distortionMap texture
    // distortionMap={normal} // The red channel of this texture is used as the distortion map. Default is null
    debug={0} /* Depending on the assigned value, one of the following channels is shown:
      0 = no debug
      1 = depth channel
      2 = base channel
      3 = distortion channel
      4 = lod channel (based on the roughness)
    */
  //reflectorOffset={-0.05} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
  />
</mesh>
  )
}

useGLTF.preload("BUGATI_V2_F1.glb");
useGLTF.preload("buggati_face.glb");