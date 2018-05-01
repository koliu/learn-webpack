module.exports = {
    // __dirname 是 webpack 的全域變數：當前檔案的所在目錄
    // entry: 進入點檔案
    // output: 輸出的目標檔案
    entry: `${__dirname}/learn-1/app/main.js`,
    output: {
        path: `${__dirname}/learn-1/public`,
        filename: "bundle.js"
    }
}