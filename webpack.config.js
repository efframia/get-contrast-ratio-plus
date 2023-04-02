const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    entry: {
        "get-contrast-ratio": './src/main.js',
        "get-contrast-ratio.min": './src/main.js',
    },
    output: {
        filename: "[name].js",
        library: "getContrastRatio",
        libraryTarget: "umd",
        globalObject: "this",
    },
    mode: "none",
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.min.js/
        })]
    },
    externals: "canvas",
}
