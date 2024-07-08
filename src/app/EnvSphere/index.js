"use client"

import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function EnvSphere() {
    const meshRef = useRef()
    const mapbgtexture = useTexture("/PNG/bg_env.png")
    useFrame((state) => {
        let t = state.clock.getElapsedTime()
        if(meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = t
        }
    })
    return (
        <group rotation={[0, Math.PI / 2, 0]}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[9, 16, 16]} />
                {/*   <meshBasicMaterial map={mapbgtexture} colorWrite={true} side={THREE.BackSide} /> */}
                <shaderMaterial
              
                    uniforms={{
                        uTex: {value:mapbgtexture},
                        uTime:{value:0},
                      }}
                    side={1}
                    vertexShader={`
                varying vec2 vUv;
                void main() {
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vUv = uv;
                }
              `}

                    fragmentShader={`
                uniform float uTime;
                uniform sampler2D uTex;
                varying vec2 vUv;

vec2 grad( ivec2 z )  // replace this anything that returns a random vector
{
    // 2D to 1D  (feel free to replace by some other)
    int n = z.x+z.y*11111;

    // Hugo Elias hash (feel free to replace by another one)
    n = (n<<13)^n;
    n = (n*(n*n*15731+789221)+1376312589)>>16;

#if 0

    // simple random vectors
    return vec2(cos(float(n)),sin(float(n)));
    
#else

    // Perlin style vectors
    n &= 7;
    vec2 gr = vec2(n&1,n>>1)*2.0-1.0;
    return ( n>=6 ) ? vec2(0.0,gr.x) : 
           ( n>=4 ) ? vec2(gr.x,0.0) :
                              gr;
#endif                              
}

float noise( in vec2 p )
{
    ivec2 i = ivec2(floor( p ));
     vec2 f =       fract( p );
	
	vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead

    return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ), 
                     dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),
                mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ), 
                     dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);
}

// -----------------------------------------------

                  void main() {
                    gl_FragColor = 1.-vec4(vUv,1., 1.0);
                        vec2 iResolution = vec2(1200.,1200.);
	 vec2 p = gl_FragCoord.xy / iResolution.xy;


     vec2 uv = vUv;
   
	
	// Modify that X coordinate by the sin of y to oscillate back and forth up in this.
	uv.x += sin(uv.y*1.0+uTime)/1.0;


vec4 tex = texture2D(uTex,vUv);
gl_FragColor = tex;

                  }

                `}
                />
            </mesh>
        </group>
    )
}