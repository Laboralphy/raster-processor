import FPSMeter from "libs/fps-meter";
import PixelProcessor from "@laboralphy/pixel-processor";

/**
 * @typedef RasterProcessorProgram {object}
 * @property init {function (animationContext: object)}
 * @property main {function (pixelContext: object, animationContext: object)}
 */

/**
 * Renders an image using a provided program.
 */
export default class RasterProcessor {
    constructor () {
        this._interval = 0 // setInterval handler
        this._animationContext = {} // animation context
    }

    /**
     * Runs the given program, fires "onFrameRender" event when rendered image is ready.
     * the "onFrameRender" function is provided with an object having tow properties
     * - canvas : the rendered image
     * - fps : the mean number of frames per second (the faster the program is, the higher this number will be).
     * @param program {RasterProcessorProgram}
     * @param canvas {HTMLCanvasElement}
     * @param interval {number}
     * @param onFrameRender {function({ canvas: HTMLCanvasElement, fps: number})}
     */
    runProgram ({
        program,
        canvas,
        interval = 1000 / 30,
        onFrameRender
    }) {
        if (!(typeof program === 'object')) {
            throw new TypeError("program parameter must be an objet with 'main' and 'init' properties")
        }
        const bFR = typeof onFrameRender === 'function'
        const oScreenCanvas = canvas
        let time = 0
        const fpsm = new FPSMeter()
        this._interval = setInterval(() => {
            fpsm.start()
            this._computeFrame(oScreenCanvas, program, time++)
            fpsm.stop()
            if (bFR) {
                onFrameRender({ canvas: oScreenCanvas, fps: fpsm.fps })
            }
        }, interval)
    }

    /**
     * Stop the current program.
     * Once stopped the program cannot be resumed.
     */
    stopProgram () {
        if (this._interval > 0) {
            clearInterval(this._interval)
        }
        this._interval = 0
    }

    /**
     * Calls PixelProcessor to render a frame
     * @param oCanvas {HTMLCanvasElement} output canvas
     * @param program {RasterProcessorProgram}
     * @param time {number} ellapsed frames
     * @private
     */
    _computeFrame (oCanvas, program, time) {
        const { init = function (oAnimContext) {}, main } = program
        const oAnimContext = this._animationContext
        oAnimContext.time = time
        oAnimContext.canvas = oCanvas
        init(oAnimContext)
        PixelProcessor.fastPaint(oCanvas, pc => main(pc, oAnimContext))
    }
}
