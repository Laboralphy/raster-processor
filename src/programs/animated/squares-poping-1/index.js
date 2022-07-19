/**
 * Fabrique une liste de nombre, indiquant les X des pixel contenue dans une grille
 * @param xStart
 * @param nCellCount
 * @param nCellWidth
 * @param nBorderWidth
 */
import Rainbow from "@laboralphy/rainbow";

const COL_COUNT = 30
const ROW_COUNT = 18
const GRID_POS_X = 30
const GRID_POS_Y = 50
const CELL_SIZE = 20
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
        white: Rainbow.parse('white'),
        black: Rainbow.parse('black')
    }
    ac.grad = Rainbow
        .spectrum('#000', '#FF0', ROW_COUNT)
        .map(c => Rainbow.parse(c))
}

function getCellColor (ac, x, y) {
    const time = ac.time
    const nx = Math.max(0, Math.min(ac.grad.length - 1, y + COL_COUNT - x + time - ROW_COUNT - COL_COUNT))
    return ac.grad[nx | 0]
}

export function main (pc, ac) {
    if (pc.y in ac.rows && pc.x in ac.cols) {
        const cx = ac.cols[pc.x]
        const cy = ac.rows[pc.y]
        const g = getCellColor(ac, cx.cellIndex, cy.cellIndex)
        pc.color.r = g.r
        pc.color.g = g.g
        pc.color.b = g.b
        pc.color.a = g.a
    } else {
        pc.color.r = ac.colors.black.r
        pc.color.g = ac.colors.black.g
        pc.color.b = ac.colors.black.b
        pc.color.a = ac.colors.black.a
    }
}
