import config from "./config.json";

export default function Greeter() {
    let greet = document.createElement("div");
    greet.textContent = config.greetText;
    return greet;
}