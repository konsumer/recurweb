// import GlslCanvas from 'glslCanvas'

import GlslCanvas from './glsl_canvas.js'

import './prism/prism.css'
import './prism/live/prism-live.css'
import './prism/prism.js'
import './prism/live/prism-live.js'
import './style.css'

// my UI
const $canvas = document.getElementById('canvas')
const $preview = document.getElementById('preview')
const $knobs = [...document.querySelectorAll('.range')]
const $knobLabels = [...document.querySelectorAll('.range + label')]
const $code = document.getElementById('code')
const $tex = [...document.querySelectorAll('input[type="file"]')]

async function updateFromHash () {
  if (document.location.hash) {
    const url = `https://gist.githubusercontent.com/${document.location.hash.slice(1)}`
    const shader = await fetch(url).then(r => r.text())
    $code.value = shader
    $code.dispatchEvent(new Event('input'))
  }
}
updateFromHash()

window.addEventListener('hashchange', updateFromHash)

$code.addEventListener('input', e => {
  preview.load($code.value)
  // update input uniforms
  let i = 0
  for (const $k of $knobs) {
    preview.setUniform(`u_x${i++}`, parseFloat($k.value))
  }
})

const preview = new GlslCanvas($canvas)
preview.load($code.value)

// knob-change updates it's label & sets u_x# uniform
for (const i in $knobs) {
  $knobs[i].addEventListener('input', e => {
    const v = parseFloat(e.target.value)
    $knobLabels[i].innerText = v.toFixed(2)
    preview.setUniform(`u_x${i}`, v)
  })
}

// add file tex handlers
for (const i in $tex) {
  $tex[i].addEventListener('change', async e => {
    const file = e?.target?.files[0]
    if (file) {
      preview.loadTexture(`u_tex${i}`, URL.createObjectURL(file), file.type)
    }
  })
}

// load some initial textures, for fun
preview.loadTexture('u_tex0', 'britney.mp4', 'video/mp4')
preview.loadTexture('u_tex1', 'hypnocat.png', 'image/png')
