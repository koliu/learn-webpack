module.exports = {
    // source map: source-map, cheap-module-source-map, eval-source-map, cheap-module-eval-source-map
    devtool: "eval-source-map",
    // __dirname 是 webpack 的全域變數：當前檔案的所在目錄
    // entry: 進入點檔案
    // output: 輸出的目標檔案
    entry: `${__dirname}/learn-1/app/main.js`,
    output: {
        path: `${__dirname}/learn-1/public`,
        filename: "bundle.js"
    },

    devServer: {
        // root path of server, default is root of project
        contentBase: "./learn-1/public",
        // 對於 SPA，瀏覽器的 History 可以設成 HTML5 History API/Hash
        // 若設成 HTML5 History API，重整時會出現 404，因為它是以其它路徑來訪問後台
        // 此處設成 true，代表 404 都指向 index.html
        historyApiFallback: true,
        // watch
        inline: true,
        port: 28080
    }
}