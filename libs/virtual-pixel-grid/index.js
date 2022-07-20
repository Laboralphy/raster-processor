import ArrayHelper from "libs/array-helper";

/**
 * Gestion de deux grilles de pixels virtuel 8 bits (0-255)
 * Gère une grille d'entrée
 * Gère une grille de sortie
 * Par ce moyen, l'écriture de pixels n'altère pas la source des pixels
 * Facilite la réalisation de filtres graphiques à base de matrice de convolution.
 */
class VirtualPixelGrid {
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

    swapGrids = () => {
        this._outputGridIndex = 1 - this._outputGridIndex
        this._inputGridIndex = 1 - this._inputGridIndex
        this._inputGrid = this._grids[this._inputGridIndex]
        this._outputGrid = this._grids[this._outputGridIndex]
    }
}

export default VirtualPixelGrid
