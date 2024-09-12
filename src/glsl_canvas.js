// this is a very minimal glslcanvas
// tailored to my usecase

/* global requestAnimationFrame */

import * as THREE from 'three'

const vertexShader = `
void main() {
  gl_Position = vec4( position, 1.0 );
}`

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    gl_FragColor=vec4(0.0, 0.0, 0.0, 1.0);
}
`

export default class GlslCanvas {
  constructor (canvas, options = {}) {
    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.camera = new THREE.Camera()
    this.camera.position.z = 1
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    const uniforms = {
      u_time: { type: 'f', value: 0.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(canvas.width, canvas.height) },
      u_tex0: { type: 'sampler2D' },
      u_tex1: { type: 'sampler2D' },
      u_x0: { type: 'f', value: 0.0 },
      u_x1: { type: 'f', value: 0.0 },
      u_x2: { type: 'f', value: 0.0 },
      u_x3: { type: 'f', value: 0.0 }
    }

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.scene.add(this.mesh)

    this.render = this.render.bind(this)
    this.render()
  }

  render () {
    this.material.uniforms.u_time.value += this.clock.getDelta()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render)
  }

  load (shader) {
    this.material.fragmentShader = shader
    this.material.needsUpdate = true
  }

  loadTexture (name, url, type) {
    if (type.startsWith('image')) {
      this.material.uniforms[name].value = new THREE.TextureLoader().load(url)
    } else if (type.startsWith('video')) {
      const video = document.createElement('video')
      video.src = url
      video.muted = true
      video.loop = true
      video.play()
      this.material.uniforms[name].value = new THREE.VideoTexture(video)
    }
  }

  setUniform (name, value) {
    if (name.startsWith('u_tex')) {
      this.loadTexture(name, value)
    }
    this.material.uniforms[name].value = value
    this.material.needsUpdate = true
  }
}
