import GlslCanvas from 'glslCanvas'

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

// Hash is gist.
if (document.location.hash) {
  const url = `https://gist.githubusercontent.com/${document.location.hash.slice(1)}`
  const shader = await fetch(url).then(r => r.text())
  $code.value = shader
  $code.dispatchEvent(new Event('input'))
}

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
  const r = new RegExp(`^[ \t]*uniform *sampler2D *u_tex${index} *;(.*)`, 'gm')
  const m = r.exec($code.value)
  const newline = `uniform sampler2D u_tex${index}; // ${url}`
  if (m && m[0]) {
    $code.value = $code.value.replace(r, newline)
    $code.dispatchEvent(new Event('input'))
    preview.loadTexture(`u_tex${index}`, url, {})
  } else {
    $code.value = `${newline}\n\n${$code.value}`
    $code.dispatchEvent(new Event('input'))
    preview.loadTexture(`u_tex${index}`, url, {})
  }
}

// add file tex handlers
for (const i in $tex) {
  $tex[i].addEventListener('change', async e => {
    const file = e?.target?.files[0]
    if (file) {
      // these creatres shorter URLs (but non-sharable code)
      setTex(i, URL.createObjectURL(file))
      // setTex(i, await convertBase64(file))
    }
  })
}
