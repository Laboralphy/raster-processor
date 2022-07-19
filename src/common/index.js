import Rainbow from "@laboralphy/rainbow";

export function isInRectangle (x, y, x0, y0, w, h) {
    return x >= x0 && x < x0 + w - 1 && y >= y0 && y < y0 + h - 1
}

export function setColor (color, sColor) {
    const c = Rainbow.parse(sColor)
    if (!('a' in c)) {
        c.a = 255
    }
    Object.assign(color, c)
}
