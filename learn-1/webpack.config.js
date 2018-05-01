module.exports = {
    // __dirname 是 webpack 的全域變數：當前檔案的所在目錄
    // entry: 進入點檔案
    // output: 輸出的目標檔案
    entry: `${__dirname}/app/main.js`,
    output: {
        path: `${__dirname}/public`,
        filename: "bundle.js"
    }
}