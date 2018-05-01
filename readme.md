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
