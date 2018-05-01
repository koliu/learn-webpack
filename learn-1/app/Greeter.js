import config from "./config.json";
//使用 import 導入 css 檔，再由 style-loader 注入到 html.head
import mainStyles from './main.scss';

export default function Greeter() {
    let greet = document.createElement("div");
    greet.textContent = config.greetText;
    greet.classList.add(mainStyles.root1);
    return greet;
}