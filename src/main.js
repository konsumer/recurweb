import GlslCanvas from 'glslCanvas'

import './style.css'
import 'prism-theme-vars/base.css'
import 'prism-theme-vars/themes/vitesse-dark.css'

/* global requestAnimationFrame */

// my UI
const $canvas = document.getElementById('canvas')
const $preview = document.getElementById('preview')
const $knobs = [...document.querySelectorAll('.range')]
const $knobLabels = [...document.querySelectorAll('.range + label')]
const $code = document.getElementById('code')
const $tex = [...document.querySelectorAll('input[type="file"]')]

// handle URL, limited to 2MB
if (document.location.hash) {
  $code.value = atob(decodeURIComponent(document.location.hash.slice(1)))
}

$code.addEventListener('input', e => {
  preview.load($code.value)
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
  // set initial value, so they are in sync
  preview.setUniform(`u_x${i}`, 0)
}

// turn a file into a base64 URL
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

// replace the tex uniform-def in code with new url
function setTex (index, url) {
  const r = new RegExp(`^[ \t]*uniform *float *u_x${index} *;(.*)`, 'gm')
  const m = r.exec($code.value)
  if (m && m[0]) {
    $code.value = $code.value.replace(r, `uniform float u_x${index}; // ${url}`)
    $code.dispatchEvent(new Event('input'))
  }
}

// add file tex handlers
for (const i in $tex) {
  $tex[i].addEventListener('change', async e => {
    const file = e?.target?.files[0]
    if (file) {
      setTex(i, await convertBase64(file))
    }
  })
}
