if (process.env.NODE_ENV === 'production'){
    module.exports = require('./dist/get-contrast-ratio.min')
} else{
    module.exports = require('./dist/get-contrast-ratio')
}
