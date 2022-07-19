const oRequire = require.context("./programs", true, /^(.*\.js)$/)
const oProgramRegistry = {}

oRequire.keys().forEach(function (key) {
    oProgramRegistry[key] = oRequire(key)
});

export default oProgramRegistry
