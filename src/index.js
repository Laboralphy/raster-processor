/**
 * Une grille de 10 18 qui apparait par fondu enchainé
 * ligne par ligne du bas vers le haut.
 */

import PixelProcessor from '@laboralphy/pixel-processor'
import cfg from './config'

const oAnimContext = {
}


function computeFrame (oCanvas, p, time) {
    const { init = function () {}, main } = p
    oAnimContext.time = time
    oAnimContext.canvas = oCanvas
    init(oAnimContext)
    PixelProcessor.paint(oCanvas, pc => main(pc, oAnimContext))
}

function runProgram (f, duration, interval) {
    const oScreenCanvas = document.getElementById('canvas')
    const oFPS = document.getElementById('fps')
    return new Promise(resolve => {
        const oProgress = document.getElementById('progress')
        oProgress.setAttribute('min', '0')
        oProgress.setAttribute('max', duration.toString())
        oProgress.setAttribute('value', '0')
        let time = 0
        const oContext = oScreenCanvas.getContext('2d')
        oContext.imageSmoothingEnabled = false
        const aPerfs = []
        const t = setInterval(() => {
            const t1 = performance.now()
            oProgress.setAttribute('value', time.toString())
            computeFrame(oScreenCanvas, f, time)
            time++
            if (time > duration) {
                clearInterval(t)
                resolve()
            }
            const t2 = performance.now()
            aPerfs.push(t2 - t1)
            while (aPerfs.length > 10) {
                aPerfs.shift()
            }
            oFPS.childNodes[0].textContent = (Math.round(1000 / (aPerfs.reduce((prev, x) => prev + x, 0) / aPerfs.length))).toString()
        }, interval)
    })
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

function assignShortcuts (prog, frames, fps) {
    const createURL = (f, i) => {
        return location.protocol + '//' + location.host + '?prog=' + prog + '&frames=' + f + '&fps=' + i
    }
    document.getElementById('frame_less').addEventListener('click', () => location.href = createURL(Math.max(50, Math.floor(frames * 0.75)), fps))
    document.getElementById('frame_more').addEventListener('click', () => location.href = createURL(Math.max(50, Math.floor(frames * 1.25)), fps))
    document.getElementById('fps_less').addEventListener('click', () => location.href = createURL(frames, Math.max(10, Math.floor(fps * 0.75))))
    document.getElementById('fps_more').addEventListener('click', () => location.href = createURL(frames, Math.max(10, Math.floor(fps * 1.25))))
}

async function main () {
    const { prog = '', frames = 1000, fps = 30 } = parseParams(location.search)
    assignShortcuts(prog, frames, fps)
    if (!prog) {
        writeProgramList()
    } else {
        const nInterval = Math.round(1000 / fps)
        const sKey = getProgramKey(prog)
        if (sKey) {
            console.info('running program', sKey, 'frames', frames, 'interval', nInterval)
            await runProgram(cfg[sKey], frames, nInterval)
            console.info('done')
        }
    }
}

window.addEventListener('load', main)
