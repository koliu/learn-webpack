import Greeter from "./Greeter";
//使用 import 導入 css 檔，再由 style-loader 注入到 html.head
import './main.css';
document.getElementById("root").appendChild(Greeter());