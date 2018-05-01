# Learn-Webpack

---

## Learn-1: [入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f)

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

* 有四種設定值：
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
{
    module: {
        rules: [{
            test: /\.css$/,
            // 同時使用多個 loader 來解析 css
            // 順序：下(先用) -> 上(後用)
            use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        modules: true
                    }
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