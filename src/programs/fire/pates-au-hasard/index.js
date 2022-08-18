import Rainbow from '@laboralphy/rainbow'
import PixelGrid8Bit from 'libs/pixel-grid-8bit'

export function init (frameContext) {
    const width = frameContext.canvas.width
    const height = frameContext.canvas.height
    if (!frameContext.init) {
        frameContext.init = true
        frameContext.grids = new PixelGrid8Bit(width, height)
    }
    for (let n = 0; n < 20; ++n) {
        const x = Math.random() * width | 0
        const y = Math.random() * (height - 6) | 0
        frameContext.grids.rect(x, y, 4, 6, 255)
    }
    frameContext.grids.swapGrids()
}

const MEAN = [
    [0, 1/5, 0],
    [1/5, 1/5, 1/5],
    [0, 1/5, 0]
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
    pixelContext.color = y > fc.canvas.height - 6 ? 0x000000FF : (0xFF000000 + (v << 16) + (v << 8) + v)
}
