/**
 * Une grille de 10 18 qui apparait par fondu enchainé
 * ligne par ligne du bas vers le haut.
 */

import PixelProcessor from '@laboralphy/pixel-processor'
import cfg from './config'
import FPSMeter from "libs/fps-meter";

const oAnimContext = {
}

function computeFrame (oCanvas, p, time) {
    const { init = function () {}, main } = p
    oAnimContext.time = time
    oAnimContext.canvas = oCanvas
    init(oAnimContext)
    PixelProcessor.fastPaint(oCanvas, pc => main(pc, oAnimContext))
}

function runProgram (f, duration, interval) {
    const oScreenCanvas = document.getElementById('canvas')
    const oFPS = document.getElementById('fps')
    const oFPSOutput = oFPS.childNodes[0]
    let time = 0
    const fpsm = new FPSMeter()
    setInterval(() => {
        fpsm.start()
        computeFrame(oScreenCanvas, f, time)
        fpsm.stop()
        oFPSOutput.textContent = fpsm.fps.toString()
    }, interval)
}

function getProgramKey (sSearch) {
    return Object.keys(cfg).find(s => {
        const a = s.split('/')
        return !!a.find(x => x === sSearch)
    })
}

function parseParams (sSearch) {
    const oParams = {}
    sSearch
        .substring(1)
        .split('&')
        .map(x => {
            const a = x.match(/^([^=]+)=(.*)$/)
            return a ? {
                param: a[1],
                value: isNaN(parseInt(a[2])) ? a[2] : parseInt(a[2])
            } : null
        })
        .filter(x => !!x)
        .forEach(({ param, value }) => {
            oParams[param] = value
        })
    return oParams
}

function writeProgramList () {
    const oList = document.querySelector('#program_list')
    Object.keys(cfg).forEach(x => {
        const sProgKey = x.split('/').filter(s => s !== 'index.js').pop()
        const oListItem = document.createElement('li')
        const oAnchor = document.createElement('a')
        oAnchor.setAttribute('href', location.protocol + '//' + location.host + '?prog=' + sProgKey)
        oAnchor.appendChild(document.createTextNode(sProgKey))
        oListItem.appendChild(oAnchor)
        oList.appendChild(oListItem)
    })
}

async function main () {
    const { prog = '' } = parseParams(location.search)
    const frames = 1000
    const fps = 30
    if (!prog) {
        writeProgramList()
    } else {
        const nInterval = Math.round(1000 / fps)
        const sKey = getProgramKey(prog)
        if (sKey) {
            runProgram(cfg[sKey], frames, nInterval)
        }
    }
}

window.addEventListener('load', main)
