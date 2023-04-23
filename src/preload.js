// preload.js

// const { contextBridge, ipcRenderer } = require("electron");

// // All the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.

// contextBridge.exposeInMainWorld("electronAPI", {
//   sendData: (data) => ipcRenderer.send("inp", data),
// });

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
