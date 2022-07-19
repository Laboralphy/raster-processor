/**
 *
 * @param pc {PixelContext}
 */
export function main (pc) {
    const {
        x, y,
        color,
        region
    } = pc
    const fx = x / region.width
    const fy = y / region.height
    color.r = fx * 255 | 0
    color.g = (1 - fx) * 255 | 0
    color.b = fy * 255 | 0
    color.a = 255
}