import * as THREE from "three"
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { Badge } from "@pmndrs/branding"
import Environment from "@react-three/drei/Environment"
import { Loader, Torus, useTexture, Shadow } from "@react-three/drei"
import { MeshDistortMaterial } from "./DistortionMaterial"
import Overlay, { Socials } from "./Overlay"

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function DistortedTorus(props) {
  const ref = useRef()
  const { size, viewport } = useThree()
  const textures = useTexture(["/ao.jpg", "/normal.jpg", "/height.png", "/roughness.jpg"])
  const [ao, normal, height, roughness] = textures
  const [rEuler, rQuaternion] = useMemo(() => [new THREE.Euler(), new THREE.Quaternion()], [])

  useLayoutEffect(() => {
    textures.forEach((texture) => ((texture.wrapT = texture.wrapS = THREE.RepeatWrapping), texture.repeat.set(4, 4)))
  }, [textures])

  useFrame(({ mouse }) => {
    rEuler.set((mouse.y * viewport.height) / 100, (mouse.x * viewport.width) / 100, 0)
    ref.current.quaternion.slerp(rQuaternion.setFromEuler(rEuler), 0.1)
  })

  return (
    <Torus ref={ref} args={[5, 1.5, isMobile ? 128 : 512, isMobile ? 128 : 512]} {...props}>
      <MeshDistortMaterial
        color="white"
        metalness={0.85}
        roughness={0.6}
        radius={1}
        distort={0.2}
        speed={3}
        resolution={[size.width, size.height]}
        aoMap={ao}
        normalMap={normal}
        normalScale={[2, 2]}
        displacementMap={height}
        roughnessMap={roughness}
        tranparent
        transmission={0.9}
      />
    </Torus>
  )
}

export default function App() {
  return (
    <>
      <Overlay />
      <Canvas
        pixelRatio={[1, 2]}
        camera={{ position: [0, 0, 20], near: 0.1, far: 100, fov: 50 }}
        onCreated={({ gl }) => (gl.toneMappingExposure = 1.5)}>
        <spotLight position={[0, 30, 40]} />
        <spotLight position={[-50, 30, 40]} />
        <Suspense fallback={null}>
          <DistortedTorus position={[0, 0.5, 0]} />
          <Environment files="photo_studio_01_1k.hdr" />
          <Shadow opacity={0.2} scale={[9, 1.5, 1]} position={[0, -8, 0]} />
        </Suspense>
      </Canvas>
      <Loader />
      <Badge />
      <Socials />
    </>
  )
}
