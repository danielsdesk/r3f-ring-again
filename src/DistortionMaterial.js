import * as THREE from "three"
import React, { useState } from "react"
import { MeshPhysicalMaterial } from "three"
import { useFrame } from "react-three-fiber"
import { distort, voronoi, perlin } from "./distort"

class DistortMaterialImpl extends MeshPhysicalMaterial {
  _time
  _distort
  _radius
  _resolution

  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._distort = { value: 0.4 }
    this._radius = { value: 1 }
    this._resolution = { value: new THREE.Vector2() }
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort

    shader.vertexShader = `
      uniform float time;
      uniform float radius;
      uniform float distort;
      ${distort}
      ${voronoi}
      ${perlin}
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
        vec2 p = vUv;
        float brightness = 0.;
        for (float i = 1.; i <= 10.; i++) {
          float angle = time /(3.2 * i);
          vec2 direction = vec2(cos(angle), sin(angle));
          brightness += cos(dot(p, direction));
        }
        brightness = abs(mod(brightness, 2.)-1.);
        vec4 myWorldPosition = modelMatrix * vec4(position, 1.0);
        float updateTime = time / 50.0;
        float noise2 = easeInOutCirc(snoise(vec3(myWorldPosition.xyz / 40.0 + updateTime * 2.0)));
        vec3 transformed;
        if (noise2 > 0.2) {
          float noise = 2.0 * (perlin(position +  (1.0 + 10.0 * noise2)));
          transformed = position * (noise * brightness * pow(distort, 2.0) + radius);
        } else {
          transformed = vec3(position);
        }
        `,
    )

    shader.fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      ${distort}
      ${shader.fragmentShader}
    `
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      #include <dithering_fragment>
      float noise = snoise(vec3(gl_FragCoord.xyz / (2000.0) + time * 0.1));
      if (noise > 0.5) {
        float gray = (dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114)));
        gl_FragColor = vec4((0.8 * (1.0-gray) + 0.2));
      } else {
        gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a);
      }
      `,
    )
  }

  get time() {
    return this._time.value
  }

  set time(v) {
    this._time.value = v
  }

  get distort() {
    return this._distort.value
  }

  set distort(v) {
    this._distort.value = v
  }

  get radius() {
    return this._radius.value
  }

  set radius(v) {
    this._radius.value = v
  }

  get resolution() {
    return this._resolution.value
  }

  set resolution(v) {
    this._resolution.value = v
  }
}

export const MeshDistortMaterial = React.forwardRef(({ speed = 1, ...props }, ref) => {
  const [material] = useState(() => new DistortMaterialImpl(), [])
  useFrame((state) => {
    if (material) {
      material.time = state.clock.getElapsedTime() * speed
    }
  })
  return <primitive object={material} ref={ref} attach="material" {...props} />
})
