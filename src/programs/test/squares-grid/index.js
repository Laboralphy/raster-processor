/**
 * Fabrique une liste de nombre, indiquant les X des pixel contenue dans une grille
 * @param xStart
 * @param nCellCount
 * @param nCellWidth
 * @param nBorderWidth
 */
import Rainbow from "@laboralphy/rainbow";

const COL_COUNT = 32
const ROW_COUNT = 24
const GRID_POS_X = 0
const GRID_POS_Y = 0
const CELL_SIZE = 10
const BORDER_SIZE = 2

/**
 * Fabrique un registre d'indice.
 * Chaque élément à pour clé l'indice d'axe du pixel
 * et a pour valeur {
 *   x: valeur du pixel local à la grille
 *   cellIndex: indice de la cellule
 *   cellLocalX: indice du pixel interne de la cellule
 * }
 * @param nStart
 * @param nCellCount
 * @param nCellWidth
 * @param nBorderWidth
 * @returns {{}}
 */
function buildCellIndices (nStart, nCellCount, nCellWidth, nBorderWidth) {
    const oY = {}
    const nPixelCount = nCellCount * nCellWidth
    for (let x = 0; x < nPixelCount; ++x) {
        const xLocal = x % nCellWidth
        if (xLocal < (nCellWidth - nBorderWidth)) {
            oY[(x + nStart).toString()] = {
                x,
                cellIndex: x / nCellWidth | 0,
                cellLocalX: x % nCellWidth
            }
        }
    }
    return oY
}

// il faudrait que les carré apparaissent du bas vers le haut en alpha
// 1 afficher les carré de couleur differente

export function init (ac) {
    ac.cols = buildCellIndices(GRID_POS_X, COL_COUNT, CELL_SIZE, BORDER_SIZE)
    ac.rows = buildCellIndices(GRID_POS_Y, ROW_COUNT, CELL_SIZE, BORDER_SIZE)
    ac.colors = {
        white: 0xFFFFFFFF,
        black: 0xFF000000
    }
    ac.grad = Rainbow
        .spectrum('#000', '#FF0', ROW_COUNT)
        .map(c => Rainbow.parse(c))
        .map(c => c.a << 24 | c.b << 16 | c.g << 8 | c.r)
}

function getCellColor (ac, x, y) {
    const time = ac.time
    let nx0 = y + COL_COUNT - x + time - ROW_COUNT - COL_COUNT
    const nx = Math.max(0, Math.min(ac.grad.length - 1, nx0))
    return ac.grad[nx | 0]
}

export function main (pc, ac) {
    if (pc.y in ac.rows && pc.x in ac.cols) {
        const cx = ac.cols[pc.x]
        const cy = ac.rows[pc.y]
        pc.color = getCellColor(ac, cx.cellIndex, cy.cellIndex)
    } else {
        pc.color = ac.colors.black
    }
}
