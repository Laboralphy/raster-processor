class FPSMeter {
    constructor () {
        this._times = []
        this._measures = []
        this._maxMeasures = 10
    }

    start () {
        this._times.push(performance.now())
    }

    stop () {
        const t = this._times.pop()
        const m = this._measures
        const mx = this._maxMeasures
        m.push(performance.now() - t)
        while (m.length > mx) {
            m.shift()
        }
    }

    get fps () {
        return Math.round(1000 / (this._measures.reduce((prev, curr) => prev + curr, 0) / this._measures.length))
    }
}

export default FPSMeter
