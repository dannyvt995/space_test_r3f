"use client"
import { Lightformer, Environment,useTexture} from "@react-three/drei";
export default function EnvironmentCustom() {
  const [texture1, texture2] = useTexture(["/envc.png", "envc2.png"])
    return (
        <Environment resolution={512} >
        {/* Ceiling */}
        <Lightformer color={"white"} intensity={2} rotation-x={Math.PI / 1} position={[-5, 2, -10]} scale={[7, 7, 7]} target={[0,0,0]}/>

        {/* Sides */}
        <Lightformer color={"white"} intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -2]} scale={[2, 2, 2]}  target={[0,0,0]}/>
       
        <Lightformer color={"white"} intensity={2} rotation-y={-Math.PI / 2} position={[2, 1, -15]} scale={[2, 2, 2]} target={[0,0,0]}/>
        {/* Key */}
        {/*    <Lightformer color={"blue"} form="ring" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} /> */}
      </Environment>
    )
}