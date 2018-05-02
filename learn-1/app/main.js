import Greeter from "./Greeter";
import printMe from "./PrintMe";

document.querySelector(".root").appendChild(Greeter());

function appendPrintMe() {
    const btn = document.createElement("button");
    btn.textContent = "Print Me";
    btn.addEventListener("click", printMe);
    document.querySelector(".root").appendChild(btn);
}
appendPrintMe();

if (module.hot) {
    module.hot.accept('./PrintMe.js', function() {
        console.log('Accepting the updated printMe module!');
        printMe();
    })
}