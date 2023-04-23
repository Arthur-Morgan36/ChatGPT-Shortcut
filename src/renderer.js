const { ipcRenderer } = require("electron");

const KEYS = {
  F12: "f12",
  ESC: "escape",
  ENTER: "enter",
};

const inputField = document.querySelector(".input-field");

function handleKeyPress(event) {
  // You can put code here to handle the keypress.
  if (!Object.values(KEYS).includes(document.getElementById("last-keypress")))
    return;

  document.getElementById("last-keypress").innerText = event.key;

  if (event.key === KEYS.ENTER) {
  }

  console.log(`You pressed ${event.key}`);
}

window.addEventListener("keyup", handleKeyPress, true);

inputField.focus();

document.addEventListener("keydown", (key) => {
  if (key.code === "Enter") ipcRenderer.send("inp", inputField.value);
});

ipcRenderer.on("inp-done", (_, data) => {
  console.log(data);
});
