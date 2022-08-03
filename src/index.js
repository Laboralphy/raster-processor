/**
 * Une grille de 10 18 qui apparait par fondu enchainé
 * ligne par ligne du bas vers le haut.
 */

import cfg from './config'
import CanvasHelper from 'libs/canvas-helper';
import RasterProcessor from 'libs/raster-processor';
import { parseParams } from 'libs/parse-url-parameters';
import SteamCard from 'libs/steam-card';

function getProgramKey (sSearch) {
    return Object.keys(cfg).find(s => {
        const a = s.split('/')
        return !!a.find(x => x === sSearch)
    })
}

function writeProgramList () {
    const oList = document.querySelector('#program_list')
    const sc = new SteamCard()
    sc.loadCSS()
    Object.keys(cfg).forEach(x => {
        const aPath = x.replace(/\\/g, '/').split('/').filter(s => s !== 'index.js')
        const sProgKey = aPath.pop()
        const sFolder = aPath.pop()
        const oSteamCard = sc.buildCard({
            title: sProgKey,
            image: './images/thumbnails/' + sProgKey + '.png',
            mark: sFolder,
            click: () => {
                location.href = location.protocol + '//' + location.host + '?prog=' + sProgKey
            }
        })
        oList.appendChild(oSteamCard)
    })
    sc.declareElements([...document.querySelectorAll('.steam-card')])
}

async function main () {
    const { prog = '' } = parseParams(location.search)
    const fps = 30
    const rp = new RasterProcessor()
    const oOutputCanvas = document.getElementById('canvas')
    const oOutputContext = oOutputCanvas.getContext('2d')
    if (!prog) {
        writeProgramList()
    } else {
        const nInterval = Math.round(1000 / fps)
        const sKey = getProgramKey(prog)
        if (sKey) {
            rp.runProgram({
                canvas: CanvasHelper.createCanvas(320, 240),
                program: cfg[sKey],
                interval: nInterval,
                onFrameRender: ({ canvas }) => {
                    oOutputContext.drawImage(canvas, 0, 0)
                }
            })
        }
    }
}

window.addEventListener('load', main)
