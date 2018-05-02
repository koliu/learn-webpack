const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // __dirname 是 webpack 的全域變數：當前檔案的所在目錄
    // entry: 進入點檔案
    // output: 輸出的目標檔案
    entry: {
        main: `${__dirname}/learn-1/app/main.js`
    },
    output: {
        path: `${__dirname}/learn-1/public`,
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /(\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: "/node_modules/"
        }, {
            test: /(\.scss|\.css)$/,
            // 同時使用多個 loader 來解析 css
            // 順序：下(先用) -> 上(後用)
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        // 啟用 css modules
                        modules: true,
                        // 指定 css 的類別名稱，預設為 import { className } from "./style.css" 的 className
                        localIdentName: '[name]__[local]--[hash:base64:5]',
                        url: false,
                        minimize: true,
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }]
            })
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Custom template',
            template: `${__dirname}/learn-1/app/index.tmpl.html`
        }),
    ],
}