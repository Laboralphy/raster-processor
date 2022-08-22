import Rainbow from '@laboralphy/rainbow'
import PixelGrid8Bit from 'libs/pixel-grid-8bit'
import Bresenham from "libs/bresenham"

const PALETTE = Rainbow
    .gradient({
        0: '#100',
        16: '#400',
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
    }

    const aAnglesN = [0, 1, 2, 3, 4]
    const aAnglesR = aAnglesN.map(a => (Math.PI * 2) * (frameContext.time + a * 360 / 5) / 360)
    const aPos = aAnglesR.map(a => ({
        x: 75 * Math.sin(a),
        y: 75 * Math.cos(a)
    }))

    const w2 = width >> 1
    const h2 = (height >> 1) + (height >> 3)

    const bline = n => Bresenham.line(aPos[n].x + w2, aPos[n].y + h2, aPos[(n + 2) % 5].x + w2, aPos[(n + 2) % 5].y + h2, (x, y, n) => {
        if (n % 3 === 0) {
            // const c = Math.random() > 0.75 ? 255 : Math.floor(Math.random() * 64 + 128)
            const c = Math.sin(n) * 64 + 64 + Math.random() * 128
            frameContext.grids.rect(x, y, 4, 4, Math.floor(c))
        }
    })

    bline(0)
    bline(1)
    bline(2)
    bline(3)
    bline(4)

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
