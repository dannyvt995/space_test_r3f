export  const NoiseShader = {
    uniforms: {
      tDiffuse: { value: null },
      amount: { value: 0. }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;
      float random(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        vec2 seed = vUv + fract( 0.02);
        color.rgb += random(seed) * amount;
      
        gl_FragColor =color;
        //  vec4 noise = vec4(random(seed) * amount);
        // gl_FragColor =  mix(color, color + noise, 1.);
      }
    `
  };
  