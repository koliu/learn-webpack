const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
    // source map: source-map, cheap-module-source-map, eval-source-map, cheap-module-eval-source-map
    devtool: "eval-source-map",
    devServer: {
        // root path of server, default is root of project
        contentBase: "./learn-1/public",
        // 對於 SPA，瀏覽器的 History 可以設成 HTML5 History API/Hash
        // 若設成 HTML5 History API，重整時會出現 404，因為它是以其它路徑來訪問後台
        // 此處設成 true，代表 404 都指向 index.html
        historyApiFallback: true,
        // watch & auto reload page (default: true)
        // inline: false,
        port: 28080,
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ],
});