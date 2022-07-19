function isInRectangle (x, y, x0, y0, w, h) {
    return x >= x0 && x < x0 + w - 1 && y >= y0 && y < y0 + h - 1
}

export function main (pc, c) {
    if (isInRectangle(pc.x, pc.y, 400, 100, 100, 100)) {
        pc.color.r = c.r
        pc.color.g = c.g
        pc.color.b = c.b
        pc.color.a = 255
    } else {
        pc.color.r = 0
        pc.color.g = 0
        pc.color.b = 0
        pc.color.a = 255
    }
}
