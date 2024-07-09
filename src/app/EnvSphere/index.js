"use client"

import { useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"


export default function EnvSphere() {
    const groupRef = useRef()
    const meshRef = useRef()
    const mapbgtexture = useTexture("/PNG/bg_env.png")
    const { viewport, camera } = useThree()
    useFrame((state) => {
        let t = state.clock.getElapsedTime()
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = t

            // meshRef.current.position.set(-camera.position.x*4,-camera.position.y*4,-camera.position.z*4)

            // meshRef.current.rotation.copy(camera.rotation)
        }

    })
    return (
        <group ref={groupRef} rotation={[0,Math.PI * -1.2,0]}>
            <mesh ref={meshRef} lookAt={[0, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[viewport.width * 5, viewport.height * 5]} />
                <sphereGeometry args={[15, 8, 8]} />
                {/*   <meshBasicMaterial map={mapbgtexture} colorWrite={true} side={THREE.BackSide} /> */}
                <shaderMaterial

                    uniforms={{
                        uTex: { value: mapbgtexture },
                        uTime: { value: 0 },
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

vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}


// -----------------------------------------------


vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


                  void main() {
                    gl_FragColor = 1.-vec4(vUv,1., 1.0);
                        vec2 iResolution = vec2(1200.,1200.);
	 vec2 p = gl_FragCoord.xy / iResolution.xy;
     p = vUv;
     vec3 col = vec3(0.);
col = pal( p.y, vec3(0.67	,1.0	,0.10),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.1) );

     vec2 uv = vUv;
    if(uv.y>.42) {
    // Modify that X coordinate by the sin of y to oscillate back and forth up in this.
	uv.x += sin(uv.y*1.0+uTime)/1.0;


vec4 tex = texture2D(uTex,uv);


   vec3 colorup = vec3(-15.720,-0.007,0.185) ; 
    vec3 colordown = vec3(-0.465,0.006,0.126) ; 
    colordown = normalize(colordown) ;
    colorup = normalize(colorup) ; 
    vec3 mixed = mix(colordown,colorup,pow(0.488,p.y)); 

     vec3 p3 = vec3(p, uTime*0.025);
    float value;
	
	value = simplex3d_fractal(p3*8.0+8.0);
	value = 0.5 + 0.5*value;

    gl_FragColor = vec4(mixed * value,1.0); 
//gl_FragColor = tex;
    
    }
	
	
                  }

                `}
                />
            </mesh>
        </group>
    )
}