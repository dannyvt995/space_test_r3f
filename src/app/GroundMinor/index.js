import { MeshReflectorMaterial } from "@react-three/drei";
export default function GroundMinor() {
    return (
        /*   <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={2} mixBlur={1} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
       {(Material, props) => <Material color="#a0a0a0"  metalness={0.2} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
      
     </Reflector> */
     <>
       <ambientLight intensity={0.5} color={0x768aab} />
      {/*  <group position={[2, .2, 2]}>
            <mesh>
                <boxGeometry args={[.5,.5,.5]}/>
                <meshBasicMaterial color={0xfffff} />
            </mesh>
       </group> */}
       <group position={[0., -.1, 0]}>
             <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            {/* <planeGeometry args={[50, 50]} /> */}
            <circleGeometry args={[8,32]}/>
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
     </group>
     </>
    
      
    )
}