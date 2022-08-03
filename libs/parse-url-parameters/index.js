/**
 * Parses a string of parameters in the URI format :
 * ?param1=value1&param2=value2
 * @param sSearch {string}
 * @returns {object}
 */
function parseParams (sSearch) {
    const oParams = {}
    sSearch
        .substring(1)
        .split('&')
        .map(x => {
            const a = x.match(/^([^=]+)=(.*)$/)
            return a ? {
                param: a[1],
                value: isNaN(parseInt(a[2])) ? a[2] : parseInt(a[2])
            } : null
        })
        .filter(x => !!x)
        .forEach(({ param, value }) => {
            oParams[param] = value
        })
    return oParams
}

export { parseParams }
