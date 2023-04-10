const KEYS = {
  F12: "f12",
  ESC: "escape",
};

function handleKeyPress(event) {
  // You can put code here to handle the keypress.
  if (!Object.values(KEYS).includes(document.getElementById("last-keypress")))
    return;

  document.getElementById("last-keypress").innerText = event.key;
  console.log(`You pressed ${event.key}`);
}

window.addEventListener("keyup", handleKeyPress, true);
