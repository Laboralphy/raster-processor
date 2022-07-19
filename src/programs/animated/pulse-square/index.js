import { isInRectangle } from '../../../common'

export function init (ac) {
    ac.alpha = Math.abs(255 * Math.sin(ac.time / 10) | 0)
}

export function main (pc, ac) {
    const c = { r: 255, g: 255, b: 255 }
    if (isInRectangle(pc.x, pc.y, 400, 100, 100, 100)) {
        pc.color.r = c.r
        pc.color.g = c.g
        pc.color.b = c.b
        pc.color.a = ac.alpha
    } else {
        pc.color.r = 0
        pc.color.g = 0
        pc.color.b = 0
        pc.color.a = 255
    }
}
