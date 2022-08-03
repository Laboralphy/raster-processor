import VirtualPixelGrid from 'libs/virtual-pixel-grid'

export function init (frameContext) {
    const width = frameContext.canvas.width
    const height = frameContext.canvas.height
    if (!frameContext.init) {
        frameContext.init = true
        frameContext.grids = new VirtualPixelGrid(width, height)
        document.getElementById('canvas').addEventListener('mousemove', event => {
            const x = event.pageX - event.target.offsetLeft
            const y = event.pageY - event.target.offsetTop
            const rx = event.target.offsetWidth / event.target.width
            const ry = event.target.offsetHeight / event.target.height
            frameContext.grids.rect(
                (x / rx | 0),
                (y / ry | 0), 4, 4, 255)
        })
    }
    frameContext.grids.swapGrids()
}

export function main (pixelContext, frameContext) {
    const fc = frameContext
    // grids est l'outil de manipulation de pixels virtuels
    const { grids } = fc
    // pixelContext est le pixel au centre de l'attention
    const { x, y, color } = pixelContext
    // Récupérer les 5 pixels virtuels concernés
    // Celui du "centre" Ainsi que les 4 pixels adjacents
    const pixSelf = grids.getPixel(x, y + 1)
    const pixBottom = grids.getPixel(x, y + 2)
    const pixLeft = grids.getPixel(x - 1, y + 1)
    const pixRight = grids.getPixel(x + 1, y + 1)
    const pixTop = grids.getPixel(x, y)
    // Calculer la moyenne des valeurs de ces pixels
    const nMean = (pixSelf + pixLeft + pixRight + pixBottom + pixTop) / 5
    // Petit ajustement aléatoire entropique
    const nEntropy = Math.random() * 2
    // Ajuster la valeur en la diminuant aléatoirement
    // Ne doit pas être en dessous de 0
    const v = Math.min(255, Math.max(0, Math.round(nMean - nEntropy)))

    grids.setPixel(x, y, v)
    pixelContext.color = y > fc.canvas.height - 6 ? 0x01000000 : (0xFF000000 + (v << 16) + (v << 8) + v)
}
