import Rainbow from '@laboralphy/rainbow'
import PixelGrid8Bit from 'libs/pixel-grid-8bit'

const PALETTE = Rainbow
    .gradient({
        0: '#000',
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
    for (let x = 0; x < width; x += 4) {
        if (Math.random() > 0.75) {
            frameContext.grids.rect(x, height - 6, 4, 6, 255)
        } else {
            let c = Math.floor(Math.random() * 64)
            frameContext.grids.rect(x, height - 4, 4, 4, c)
        }
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
