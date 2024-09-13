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

    // here my uniforms are hard-coded
    const uniforms = {
      u_time: { type: 'f', value: 0.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(canvas.width, canvas.height) },

      // only first 2 are used in recur shaders, but this might be useful if extended
      u_tex0: { type: 'sampler2D' },
      u_tex1: { type: 'sampler2D' },
      u_tex2: { type: 'sampler2D' },
      u_tex3: { type: 'sampler2D' },
      u_tex4: { type: 'sampler2D' },
      u_tex5: { type: 'sampler2D' },
      u_tex6: { type: 'sampler2D' },
      u_tex7: { type: 'sampler2D' },
      u_tex8: { type: 'sampler2D' },
      u_tex9: { type: 'sampler2D' },

      // only first 4 are used in recur shaders, but this might be useful if extended
      u_x0: { type: 'f', value: 0.0 },
      u_x1: { type: 'f', value: 0.0 },
      u_x2: { type: 'f', value: 0.0 },
      u_x3: { type: 'f', value: 0.0 },
      u_x4: { type: 'f', value: 0.0 },
      u_x5: { type: 'f', value: 0.0 },
      u_x6: { type: 'f', value: 0.0 },
      u_x7: { type: 'f', value: 0.0 },
      u_x8: { type: 'f', value: 0.0 },
      u_x9: { type: 'f', value: 0.0 }
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

  // called every frame
  render () {
    this.material.uniforms.u_time.value += this.clock.getDelta()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render)
  }

  // load new vertex shader
  load (shader) {
    this.material.fragmentShader = shader
    this.material.needsUpdate = true
  }

  // manually load texture into material (like for file-upload)
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

  // set a named uniform
  setUniform (name, value) {
    this.material.uniforms[name].value = value
    this.material.needsUpdate = true
  }
}
