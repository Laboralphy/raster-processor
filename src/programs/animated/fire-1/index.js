import Rainbow from '@laboralphy/rainbow'
import ArrayHelper from 'libs/array-helper'

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
    .map(sColor => Rainbow.parse(sColor))

export function init (frameContext) {
    const WIDTH = frameContext.canvas.width
    const HEIGHT = frameContext.canvas.height
    if (!frameContext.init) {
        frameContext.init = true
        frameContext.palette = PALETTE
        frameContext.grids = ArrayHelper.create(
            2,
            () => ArrayHelper.create(
                HEIGHT,
                () => ArrayHelper.create(
                    WIDTH,
                    () => 0
                )
            )
        )
        frameContext.inputGridIndex = 0
        frameContext.outputGridIndex = 1

        frameContext.setPixel = (x, y, v) => {
            if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
                return
            }
            frameContext.outputGrid[y][x] = v
        }

        frameContext.getPixel = (x, y) => {
            if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
                return 0
            }
            return frameContext.inputGrid[y][x]
        }

        frameContext.rect = (x, y, w, h, c) => {
            for (let yi = 0; yi < h; ++yi) {
                for (let xi = 0; xi < w; ++xi) {
                    frameContext.setPixel(x + xi, y + yi, c)
                }
            }
        }

        frameContext.swapGrids = () => {
            frameContext.outputGridIndex = 1 - frameContext.outputGridIndex
            frameContext.inputGridIndex = 1 - frameContext.inputGridIndex
            frameContext.inputGrid = frameContext.grids[frameContext.inputGridIndex]
            frameContext.outputGrid = frameContext.grids[frameContext.outputGridIndex]
        }

        frameContext.swapGrids()
    }
    for (let x = 0; x < WIDTH; x += 4) {
        if (Math.random() > 0.75) {
            frameContext.rect(x, HEIGHT - 6, 4, 6, 255)
        } else {
            let c = Math.floor(Math.random() * 64)
            frameContext.rect(x, HEIGHT - 4, 4, 4, c)
        }
    }
    frameContext.swapGrids()
}

export function main (pixelContext, frameContext) {
    const fc = frameContext
    const { getPixel, setPixel } = fc
    const { x, y, color } = pixelContext
    const pixBottom = getPixel(x, y + 1)
    const pixLeft = getPixel(x - 1, y)
    const pixSelf = getPixel(x, y)
    const pixRight = getPixel(x + 1, y)
    const pixTop = getPixel(x, y - 1)
    const nMean = (pixSelf + pixLeft + pixRight + pixBottom + pixTop) / 5
    const v = Math.min(255, Math.max(0, Math.round(nMean - Math.random())))

    setPixel(x, y - 1, v)
    const c = y > fc.canvas.height - 6 ? { r: 0, g: 0, b: 0 } : fc.palette[v]
    color.r = c.r
    color.g = c.g
    color.b = c.b
    color.a = 255
}
