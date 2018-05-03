# Learn-Webpack

> 此處主要 follow [入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f) 的實作練習(使用 Webpack 4.6)，由於該篇距今已有段時間，因此過程中踩到許多坑，而這裡的也是記錄填坑的地方…

---

## 目前實作的功能

* 將所有 js/css 打包成單一的 bundle.js(with Uglify, OccurrenceOrder, babel)
* 也可將 css 抽成獨立的檔案
* SCSS 轉換
* 可以轉譯 pug 為 html
* 可以利用 chunkhash 及 html-webpack-plugin 來注入hash 檔名及資源值

## 待處理的問題

* webpack-dev-server 的 hot 功能尚無法正常運作(有跑但Runtime 模組沒更新)
* css modules 置換原來就寫死的 class name

---

### Install

```shell
yarn init
yarn add --dev webpack
```

### Using(with command line):

1.public/index.html: 先指定之後會用 Webpack 打包產生的 bundle.js

```html
<body>
    <div id="root"></div>
    <script src="bundle.js"></script>
</body>
```

2.app/Greeter.js: CommonJS

```js
module.exports = () => {
    let greet = document.createElement("div");
    greet.textContent = "Hello, this is Greeter.js";
    return greet;
}
```

3.app/main.js: CommonJS

```js
const greeter = require("./Greeter.js");
document.getElementById("root").appendChild(greeter());
```

4.Using Webpack: 4.6.0(In command line)

    * 語法：
    ```shell
    # {entry file}: 進入點檔案
    # {destination for bundle file}: 要打包輸出的檔案
    # 格式：webpack {entry file} {destination for bundle file}
    ..\node_modules\.bin\webpack app/main.js -o public/bundle.js

    ## 坑：
    # 如果只下：..\node_modules\.bin\webpack app/main.js public/bundle.js
    # >> ERROR in multi ./app/main.js public/bundle.js
    # Module not found: Error: Can't resolve 'public/bundle.js' in 'W:\_workspace\learn-webpack\learn-1'
    # @ multi ./app/main.js public/bundle.js
    ```
5.Run public/index.html in browser >> "Hello, this is Greeter.js"

### Using(with webpack.config.js):

1.Add webpack.config.js to root of project

```js
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
```

2.Run

```shell
..\node_modules\.bin\webpack
```

* 打包的三種情境([[前端工具]Webpack2 手把手一起入門](https://dotblogs.com.tw/kinanson/2017/06/11/124206#6))
    * SPA: 監聽入口點，其餘有 import 的自動依賴進來

```javascript
entry: {
    app: [
        './src/index.js',
    ]
}
```

    * Bundle: 把不同頁面用的 js 都打包成一個檔

```javascript
entry: {
    app: [
      './src/index.js',
      './src/home.js',
      './src/index-outside.js'
    ]
}
```

    * 各頁面有獨自的 js 檔

```javascript
entry: {
    app: './src/index.js',
    home: './src/index1.js',
    indexOutside: './src/index-outside.js'
}
```


### Run webpack by npm start/npm run {custom name}

* 注意：要使用此法必須將 webpack 卡在專案根目錄(和 package.json 同一層)

```log
ERROR in Entry module not found: Error: Can't resolve './src' in 'W:\_workspace\learn-webpack'
```

* "npm start" === "..\node_modules\.bin\webpack"

```json
{
    "name": "learn-webpack",
    "scripts": {
        "start": "webpack"
    },
}
```

* "npm run wp" === "..\node_modules\.bin\webpack"

```json
{
    "name": "learn-webpack",
    "scripts": {
        "wp": "webpack"
    },
}
```

### Source Map

* 要用 Source Map 必須在 webpack.config.js 設定 devtool

```shell

```

* 設定值：[Devtool](https://webpack.js.org/configuration/devtool/)
    * source-map: 功能完全，但會降低打包速度。
    * cheap-module-source-map: 只能對應到程式碼的列號，無法對應該列中的實際行號，不利除錯，但速度快。
    * eval-source-map: 在原始碼檔案中產生對應資料，不影響打包速度，但安全性及執行時期效能較差，只適用於開發階段。
    * cheap-module-eval-source-map: 最快的打包速度，產生的 map 會和原檔同列顯示，但也和 eval-source-map 有相似的缺點。


### Webpack Dev Server

* Ref:
    * [DevServer](https://webpack.js.org/configuration/dev-server/)
    * [关于Webpack-dev-server配置的点点滴滴](https://github.com/huruji/blog/issues/10)
    * [webpack 看我就够了（三）](https://www.jianshu.com/p/b5248d441d9e)

* Install

```shell
yarn add --dev webpack-dev-server
```

* Settings

```js
// webpack.config.js
{
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
```

* Setting for run webpack-dev-server by yarn command

```json
{
    "scripts": {
        "server": "webpack-dev-server"
    }
}
```

* Run
    * 

```shell
# 依 scripts 設定執行 
npm run server
# 附加執行參數
npm run server --open --hot --colors --progress --inline --config webpack.dev.js
```

---

### Loaders

#### Babel

* Install

```shell
# babel-preset-env: for ES6
# babel-preset-react: for JSX
yarn add --dev babel-core babel-loader babel-preset-env babel-preset-react
```

* Setting

```js
// webpack.config.js
{
    module: {
        rules: [{
            test: "/(\.js)$/",
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "env"
                    ]
                }
            },
            exclude: "/node_modules/"
        }]
    }
}
```

* Adjust Code to ES6
* Run:

```shell
npm run wp
# ES6 module must test in server
npm run server
```

* Use .babelrc

```js
// webpack.config.js
{
    module: {
        rules: [{
            test: "/(\.js)$/",
            use: {
                loader: "babel-loader"
            },
            exclude: "/node_modules/"
        }]
    }
}
```

```json
// .babelrc
{
    "presets": ["env"]
}
```

#### CSS

* Ref:
    * [<06 - 心法3 - 強化> Loaders - 示範 css-loader 與 style-loader](https://ithelp.ithome.com.tw/articles/10185136)

* Install

```shell
# css-loader: @import 及 url(...) 實現 require 功能
# style-loader: 將 <style></style> 插入<head>
yarn add --dev style-loader css-loader
```

* Adjust Code

```js
// css-loader
// 解讀(右 > 左)：將 ./main.css 用 css-loader 導入 js
//使用 import 導入 css 檔
import 'css-loader!./main.css';
//or
var css = require("css-loader!./main.css");

//==============================================
// style-loader
// 解讀(右 > 左)：將 ./main.css 用 css-loader 導入 js，再由 style-loader 注入到 html.head
import 'style-loader!css-loader!./main.css';
```

* Run: npm run wp, npm run server
* Set up config of style-loader/css-loader in webpack.config.js: 如此在 import 時不用加 style-loader!css-loader!

```js
// webpack.config.js
{
    module: {
        rules: [{
            test: /\.css$/,
            // 同時使用多個 loader 來解析 css
            // 順序：下(先用) -> 上(後用)
            use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
        }]
    }
}

// or

{
    module: {
        rules: [{
            test: /\.css$/,
            //順序：右(先用) -> 左(後用)
            loaders: ['style-loader', 'css-loader']
        }]
    }
}
```

* 注意：
    * test 不能用 "" 括住，會造成："Module parse failed: Unexpected token"
        * [The issue for 'You may need an appropriate loader to handle this file type.'](https://github.com/shama/letswritecode/issues/8)
    * loader 設定的順序(下>上；右>左)，設錯會造成："Module build failed: Unknown word"

#### SCSS

* ref:
    * [sass-loader](https://github.com/webpack-contrib/sass-loader)
    * [介紹 Plugins](https://neighborhood999.github.io/webpack-tutorial-gitbook/Part1/IntroductionPlugin.html)

* install

```shell
yarn add --dev sass-loader node-sass
```

* settup

```js
// webpack.config.js
{
    module: {
        rules: [{
            test: /\.scss$/,
            //順序：右(先用) -> 左(後用)
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        }]
    }
}
```

#### CSS Module: 類似 JS Module 思維，讓所有 CSS 的類別名、動畫名都預設只作用在當前模組下，避免全域污染。

* ref:
    * [css-modules](https://github.com/css-modules/css-modules)
* Setup

```js
{
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        // 啟用 css modules
                        modules: true,
                        // 指定 css 的類別名稱，預設為 import { className } from "./style.css" 的 className
                        // localIdentName: '[name]__[local]--[hash:base64:5]'
                    }
                }]
        }]
    }
}
```

* Adjust Code:

```js
// Greeter.js
import mainStyles from './main.scss';

export default function Greeter() {
    let greet = document.createElement("div");
    // mainStyles.root1
    greet.classList.add(mainStyles.root1);
    return greet;
}
```

* 注意： css-modules 似乎只適用程式產生的 html 標籤的 class
```html
<style type="text/css">
html {
  box-sizing: border-box;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%; }

/* ... */

/* 原本 .root 也被更名為 .main__root--3Q2VU，但 html 中還是 root */
.main__root--3Q2VU {
  color: yellowgreen; }

.main__root1--1tB5V {
  color: red; }
</style>
<div class="root">
    <div class="main__root1--1tB5V">Hello, this is Greeter.js</div>
</div>
```

#### PostCSS

* ref:
    * [PostCSS](https://github.com/postcss/postcss)
    * [autoprefixer](https://github.com/postcss/autoprefixer)
    * [Webpack 4, postcss-loader and autoprefixer plugin](https://stackoverflow.com/questions/49782806/webpack-4-postcss-loader-and-autoprefixer-plugin)

* install

```shell
yarn add --dev postcss-loader autoprefixer
```

* setup

```js
// webpack.config.js
{
    module: {
        rules: [{
            test: /(\.scss|\.css)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
            }, {
                // 注意順序必須在 preCSS 後，css-loader 前
                loader: "postcss-loader",
                options: {
                    plugins: () => [require('autoprefixer')({
                        'browsers': ['> 1%', 'last 2 versions']
                    })],
                }
            }, {
                loader: "sass-loader"
            }]
        }]
    }
}
```

* Setup2: with postcss.config.js

```js
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
        })
    ]
};

// webpack.config.js
{
    module: {
        rules: [{
            test: /(\.scss|\.css)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
            }, {
                loader: "postcss-loader",
            }, {
                loader: "sass-loader"
            }]
        }]
    }
}
```

#### Pug

* [html-webpack-pug-plugin](https://github.com/negibouze/html-webpack-pug-plugin/blob/master/README.md)
    >搭配 HtmlWebpackPlugin 使用，可以讓 HtmlWebpackPlugin 產生 pug 檔(注入 pug 格式)
* [pug-loader](https://github.com/pugjs/pug-loader)
    * 關於參數的範例用法，可以參考 [html-webpack-template-pug](https://www.npmjs.com/package/html-webpack-template-pug)
    * template 的擴展：[html-webpack-template](https://github.com/jaketrent/html-webpack-template)

* Install

```shell
## yarn add --dev html-webpack-pug-plugin
yarn add --dev pug-loader

## Error: Cannot find module 'pug'
yarn add --dev pug
```

* Setup

```js
// webpack.common.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [{
                test: /(\.pug|\.jade)$/,
                use: {
                    loader: "pug-loader"
                },
                exclude: "/node_modules/"
            }]
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
    ],
}
```

* Note:
    * 在 pug 中注入 html-webpack-plugin 變數，需用 =XXX
    > title=htmlWebpackPlugin.options.title
    * 在 html 中注入 html-webpack-plugin 變數，需用 <%=XXX %>
    > <title><%= htmlWebpackPlugin.options.title %></title>

---

### Plugins

* Plugins vs. Loaders
    * Loaders: 在打包過程中對來源檔案進行處理，一次處理一個。
    * Plugins: 用來擴展 webpack 功能，直接對整個專案建構過程作用，並不直接處理單個檔案。

* 使用方式：
    1. npm install
    2. 在 webpack.config.js 中的 plugins 進行設定

#### [BannerPlugin](https://webpack.js.org/plugins/banner-plugin/): 版權宣告

* Setup

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究！')
    ],
}
```

* Result

```js
// bundle.js
/*! 版权所有，翻版必究！ */......
```

#### [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

* Description
    * 可根據自訂好的模板，為每個 entry 建立 html 檔

* Install

```shell
yarn add --dev html-webpack-plugin
```

* Add Html Template

```html
<!-- app/index.tmpl.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Webpack Learn-1 - template</title>
</head>

<body>
    <div class="root">
    </div>
</body>

</html>
```

* Setup

```js
// webpack.config.js
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究！'),
        new htmlWebpackPlugin({
            template: `${__dirname}/learn-1/app/index.tmpl.html`
        })
    ]
}
```

* Run: 執行 npm run wp 後會在 public/ 下自動建立包含 bundle.js script 的 index.html
* Custom title:
    1. Template
    ```html
    <!-- app/index.tmpl.html -->
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
    ```
    2. Setup

    ```js
    // webpack.config.js
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究！'),
        new htmlWebpackPlugin({
            title: 'Custom template',
            template: `${__dirname}/learn-1/app/index.tmpl.html`
        })
    ]
    ```

#### [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)

* ref:
    * [Webpack & The Hot Module Replacement](https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07)

* 用途：在修改程式碼後，自動刷新
* Method 1(config)
    1. 啟用 webpack-dev-server hot
    2. 加入 webpack.HotModuleReplacementPlugin
    3. 加入 webpack.NamedModulesPlugin: make it easier to see which dependencies are being patched.

* Method 2 (no config & cli): 只要 webpack-dev-server --hot --hot-only 就會自動引用 HotModuleReplacementPlugin plugins

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    devServer: {
        hot: true,
        hotOnly: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

* **待解決問題**
    * hot 有跑，但沒作用，步驟：
        1. 設定
```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    devServer: {
        hot: true,
        hotOnly: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

```js
// app/PrintMe.js
export default function printMe() {
    console.log("printMe.js init");
}
```

```js
// app/main.js
if (module.hot) {
    module.hot.accept('./PrintMe.js', function() {
        console.log('Accepting the updated printMe module!');
        printMe();
    })
}
```
        3. npm run server

```log
[HMR] Waiting for update signal from WDS...
bundle.js:1 [WDS] Hot Module Replacement enabled.
printMe.js init
```

        4. change PrintMe.js

```js
export default function printMe() {
    console.log("printMe.js modified...");
}
```

        5. Browser Log: 仍然印出「bundle.js:1 printMe.js init」，而不是「printMe.js modified...」
```log
[WDS] App hot update...
bundle.js:1 [HMR] Checking for updates on the server...
bundle.js:1 Accepting the updated printMe module!
bundle.js:1 printMe.js init
bundle.js:1 [HMR] Updated modules:
bundle.js:1 [HMR]  - ./learn-1/app/PrintMe.js
bundle.js:1 [HMR] App is up to date.
```
        6. ref:
            * [webpack-dev-sever HMR do not works, only working full reload behavior](https://github.com/webpack/webpack-dev-server/issues/1315)

#### [uglifyjs-webpack-plugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#src/components/Sidebar/Sidebar.jsx)
> 壓縮 JS
* install

```shell
yarn add --dev uglifyjs-webpack-plugin
```

* Settup:

```js
// webpack.prod.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = merge(common, {
    plugins: [
        new UglifyJsPlugin(),
    ],
});
```

#### OccurrenceOrderPlugin

>分析 id 使用的頻率，讓使用頻率高的模組用較短的 id

* Settup:

```js
// webpack.prod.js
module.exports = merge(common, {
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
});
```

#### [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)

>Extract text from a bundle, or bundles, into a separate file.

* install

```shell
yarn add --dev extract-text-webpack-plugin
```

    * webpack 4+ 相容性問題：[Webpack 4 compatibility](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701)

```shell
## for webpack 4+
yarn add --dev extract-text-webpack-plugin@next
```

* Setup for extract CSS from bundle

```js
// webpack.common.js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    module: {
        rules: [{
            test: /(\.scss|\.css)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        modules: true,
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
        new ExtractTextPlugin("styles.css"),
    ],
}
```

#### Caching & ChunkHash

> 為檔名附加 Hash，以解決檔名一樣時，瀏覽器誤以為檔案沒更新

* ref:
    * [[ Ｄ] 學 webpack2 (improve cache/ html-webpack-plugin)](https://medium.com/@ouonnz/%E5%AD%B8-webpack2-%E4%B8%8B-9c32f5a39915)
    * [Caching](https://webpack.js.org/guides/caching/#src/components/Sidebar/Sidebar.jsx)

* Setup
    * 若有使用 htmlWebpackPlugin 來產生 html，會自動補齊 chunkhash 檔名。
    * 由於會影響打包速度，所以只有在 prod 時才使用 chunkhash 檔名
    * 調整：
        * 在 webpack.prod.js 設定 output > filename 來覆蓋掉在 webpack.common.js 的設定
        * 在 webpack.prod.js 及 webpack.dev.js 分別設定 plugins > new ExtractTextPlugin("styles-[chunkhash].css")，並將 webpack.common.js 中的移除。
            * 需要個別設定是因為 webpack.merge 合併後，new ExtractTextPlugin() 並不是附蓋，所以若只在 common 及 prod 引用時，在 build prod 時會同時產生兩個檔案。
            * module 中的 use: ExtractTextPlugin.extract() 仍保留在 common 共用。

```js
// webpack.prod.js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = merge(common, {
    output: {
        filename: "bundle-[chunkhash].js"
    },
    plugins: [
        new ExtractTextPlugin("styles-[chunkhash].css"),
    ],
}

// webpack.dev.js
// 沒設定 output > filename 會沿用 common 的設定
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = merge(common, {
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ],
}
```

#### [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)

> remove/clean your build folder(s) before building

* ref:
    * [clean-webpack-plugin](https://www.google.com.tw/search?q=webpack+clean+plugin&rlz=1C1CHZL_enTW764TW764&oq=webpack+clean&aqs=chrome.1.69i57j0l5.7739j0j1&sourceid=chrome&ie=UTF-8)
    * [webpack2利用插件clean-webpack-plugin来清除dist文件夹中重复的文件](https://www.cnblogs.com/oufeng/p/6819320.html)
    * [<20 - Plugins 小幫手 03> 清除 bundle 後的資料夾 - clean-webpack-plugin](https://ithelp.ithome.com.tw/articles/10186633)

* Install

```shell
yarn add --dev clean-webpack-plugin
```

* Setup

```js
// webpack.common.js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// the path(s) that should be cleaned
const pathsToClean = [
    'learn-1/public', // removes 'learn-1/public' folder
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
    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
    ],
}
```

* 也可以使用 Node.js 的 rimraf

```js
// webpack.common.js
const rimraf = require('rimraf');
const path = require('path');

rimraf(path.join(__dirname, './learn-1/public'), () => console.log('success to remove ./learn-1/public/'));
```

---

### 環境切分

* ref:
    * [學 webpack 2 （CLI/config/webpack-dev-server/ 環境分離/babel ）](https://medium.com/@ouonnz/%E5%AD%B8-webpack-2-%E4%B8%8A-8621078de827)
    * [Production](https://webpack.js.org/guides/production/)
    * [[前端工具]Webpack2 手把手一起入門](https://dotblogs.com.tw/kinanson/2017/06/11/124206#6)

* Setup:
    1. 依環境需求拆分 webpack.config.js 為 webpack.common.js/webpack.dev.js/webpack.prod.js
        * 會用到 webpack-merge 將 webpack.common.js 合併到各區設定檔。需 yarn add --dev webpack-merge
    2. 設定 package.json
        * 利用 --config 來指定要使用的環境設定檔

```json
// package.json
{
    "scripts": {
        "build": "webpack --config webpack.prod.js",
        "start": "webpack-dev-server --config webpack.dev.js --progress",
        "start-hot": "webpack-dev-server --open --config webpack.dev.js --hot --hot-only --progress",
        "start-prod": "webpack-dev-server --config webpack.prod.js --progress"
    }
}
```

* 也可以使用 process.env.NODE_ENV 環境變數來區分

```js
// webpack.config.js

const webpackConfig = {
    entry: {
        main: `${__dirname}/learn-1/app/main.js`
    }
}

switch (process.env.NODE_ENV.trim()) {
    case "dev":
        webpackConfig.devtool = '#cheap-module-eval-source-map';
        break;
    case "prod":
        webpackConfig.devtool = '#source-map';
        webpackConfig.plugins.push(
            new webpack.BannerPlugin('版权所有，翻版必究！')
        );
        break;
}
```

```json
// package.json
{
    "scripts": {
        "dev": "set NODE_ENV=dev && webpack --watch",
        "prod": "set NODE_ENV=prod && webpack"
    }
}
```

---
## 待研究
* [webpack2引入bootstrap的坑](https://www.cnblogs.com/oufeng/p/6819161.html)
* [使用 webpack 模組化你的程式碼，讓人生更美好](https://ithelp.ithome.com.tw/users/20069901/ironman/1074)
* [Webpack@4零基础入门](https://www.jianshu.com/p/4320b1a3e3cf)