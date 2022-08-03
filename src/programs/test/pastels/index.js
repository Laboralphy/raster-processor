/**
 *
 * @param pc {PixelContext}
 */
import Rainbow from "@laboralphy/rainbow";

export function main (pc) {
    const {
        x, y,
        region
    } = pc
    const fx = x / region.width
    const fy = y / region.height
    const r = fx * 255 | 0
    const g = (1 - fx) * 255 | 0
    const b = fy * 255 | 0
    const a = 255
    pc.color = Rainbow.int32({ r, g, b, a })
}
