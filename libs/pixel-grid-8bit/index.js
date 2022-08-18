import ArrayHelper from "libs/array-helper";

/**
 * Gestion de deux grilles de pixels virtuel 8 bits (0-255)
 * Gère une grille d'entrée
 * Gère une grille de sortie
 * Par ce moyen, l'écriture de pixels n'altère pas la source des pixels
 * Facilite la réalisation de filtres graphiques à base de matrice de convolution.
 */
class PixelGrid8Bit {
    constructor (nWidth, nHeight) {
        this._width = nWidth
        this._height = nHeight
        this._grids = ArrayHelper.create(
            2,
            () => ArrayHelper.create(
                this._height,
                () => new Uint8Array(this._width)
            )
        )
        this._inputGridIndex = 0
        this._outputGridIndex = 1
        this._outputGrid = this._grids[this._outputGridIndex]
        this._inputGrid = this._grids[this._inputGridIndex]
        this._lastCM = {
            original: null,
            compiled: null
        }
    }

    setPixel (x, y, v) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return
        }
        this._outputGrid[y][x] = v
    }

    getPixel (x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return 0
        }
        return this._inputGrid[y][x]
    }

    rect (x, y, w, h, c) {
        for (let yi = 0; yi < h; ++yi) {
            for (let xi = 0; xi < w; ++xi) {
                this.setPixel(x + xi, y + yi, c)
            }
        }
    }

    swapGrids () {
        this._outputGridIndex = 1 - this._outputGridIndex
        this._inputGridIndex = 1 - this._inputGridIndex
        this._inputGrid = this._grids[this._inputGridIndex]
        this._outputGrid = this._grids[this._outputGridIndex]
    }

    compileConvolution (aMatrix) {
        if (aMatrix === this._lastCM.original) {
            return this._lastCM.compiled
        }
        const h = aMatrix.length
        const w = aMatrix[0].length
        const n = Math.min(w, h)
        const n2 = Math.floor(n / 2)
        const a = []
        for (let yi = 0; yi < n; ++yi) {
            for (let xi = 0; xi < n; ++xi) {
                const p = aMatrix[yi][xi]
                if (p) {
                    a.push({ x: xi - n2, y: yi - n2, v: p })
                }
            }
        }
        this._lastCM.compiled = a
        this._lastCM.original = aMatrix
        return a
    }

    convolution (x, y, aMatrix) {
        const a = this.compileConvolution(aMatrix)
        let v = 0
        for (let ai = 0, l = a.length; ai < l; ++ai) {
            const aai = a[ai]
            v += aai.v * this.getPixel(x + aai.x, y + aai.y)
        }
        return v
    }

    forEachPixel (pCallback) {
        const w = this._width
        const h = this._height
        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                pCallback(this, x, y)
            }
        }
    }
}

export default PixelGrid8Bit
