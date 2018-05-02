const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// the path(s) that should be cleaned
const pathsToClean = [
    'learn-1/public', // removes 'public' folder
    // 'build/*.*', // removes all files in 'build' folder
    // 'web/*.js' // removes all JavaScript files in 'web' folder
];
// the clean options to use
let cleanOptions = {
    // Absolute path to your webpack root folder (paths appended to this)
    // Default: root of your package
    root: __dirname,

    // exclude: ['shared.js'],

    // Write logs to console.
    verbose: true,

    // Use boolean "true" to test/emulate delete. (will not remove files).
    // Default: false - remove files
    dry: false,

    // If true, remove files on recompile. 
    // Default: false
    watch: false,

    // allow the plugin to clean folders outside of the webpack root.
    // Default: false - don't allow clean folder outside of the webpack root
    allowExternal: false,

    // perform clean just before files are emitted to the output dir
    // Default: false
    beforeEmit: false,
};


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
            },
            {
                test: /(\.pug|\.jade)$/,
                use: {
                    loader: "pug-loader"
                },
                exclude: "/node_modules/"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            /** Required **/
            // Inject style, script
            inject: true,
            template: `${__dirname}/learn-1/app/index.tmpl.pug`,

            /** Optional **/
            title: 'Custom template',
            filetype: 'pug'
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
    ],
}