import PixelGrid8Bit from 'libs/pixel-grid-8bit'
import Bresenham from "libs/bresenham"
import Rainbow from "@laboralphy/rainbow";
const PALETTE = Rainbow
    .gradient({
        0: '#111',
        16: '#333',
        32: '#222',
        64: '#F00',
        128: '#FF0',
        220: '#FFF',
        255: '#FFF'
    })
    .map(sColor => {
        const oColor = Rainbow.parse(sColor)
        return oColor.a << 24 | oColor.b << 16 | oColor.g << 8 | oColor.r
    })


export function init (frameContext) {
    const width = frameContext.canvas.width
    const height = frameContext.canvas.height
    if (!frameContext.init) {
        frameContext.init = true
        frameContext.palette = PALETTE
        frameContext.grids = new PixelGrid8Bit(width, height)
        document.getElementById('canvas').addEventListener('mousemove', event => {
            const x = event.pageX - event.target.offsetLeft
            const y = event.pageY - event.target.offsetTop
            const rx = event.target.offsetWidth / event.target.width
            const ry = event.target.offsetHeight / event.target.height
            const mx = (x / rx | 0)
            const my = (y / ry | 0)
            if (!frameContext.previousPixel) {
                frameContext.previousPixel = { x: mx, y: my }
            }
            Bresenham.line(mx, my, frameContext.previousPixel.x, frameContext.previousPixel.y, (x, y, n) => {
                if (n % 4 === 0) {
                    frameContext.grids.rect(x, y, 4, 4, Math.random() * 255 | 0)
                }
            })
            frameContext.previousPixel.x = mx
            frameContext.previousPixel.y = my
        })
    }
    if (frameContext.previousPixel) {
        const {x, y} = frameContext.previousPixel
        frameContext.grids.rect(x, y, 4, 4, 255)
    }
    frameContext.grids.swapGrids()
}

const MEAN = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1/5, 0, 0],
    [0, 1/5, 1/5, 1/5, 0],
    [0, 0, 1/5, 0, 0]
]

export function main (pixelContext, frameContext) {
    const fc = frameContext
    // grids est l'outil de manipulation de pixels virtuels
    const { grids } = fc
    // pixelContext est le pixel au centre de l'attention
    const { x, y, color } = pixelContext
    // Récupérer les 5 pixels virtuels concernés
    // Celui du "centre" Ainsi que les 4 pixels adjacents
    const nMean = grids.convolution(x, y, MEAN)

    // Petit ajustement aléatoire entropique
    const nEntropy = Math.random() * 2
    // Ajuster la valeur en la diminuant aléatoirement
    // Ne doit pas être en dessous de 0
    const v = Math.max(0, Math.round(nMean - nEntropy))

    grids.setPixel(x, y, v)
    pixelContext.color = y > fc.canvas.height - 6 ? 0x000000FF : fc.palette[v]
}
