// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const KEYS = {
  F12: "f12",
  ESC: "escape",
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 670,
    height: 60,
    x: 640,
    y: 270,
    resizable: false,
    useContentSize: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    focusable: true,
    skipTaskbar: true,
    title: "",
    titleBarStyle: "hidden",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile("src/index.html");

  mainWindow.webContents.on("before-input-event", (ev, inp) => {
    if (inp.key.toLowerCase() === KEYS.F12) {
      console.log("Opening Dev Tools");
      ev.preventDefault();

      mainWindow.webContents.openDevTools();
    }

    if (inp.key.toLowerCase() === KEYS.ESC) {
      console.log("App Minimzed");
      BrowserWindow.getFocusedWindow().minimize();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow();
  focusOnInputField();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// For applications and their menu bar to stay active until the user quits // Quit when all windows are closed, except on macOS. There, it's common
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("invokeAction", function (event, data) {
  var result = processData(data);
  event.sender.send("actionReply", result);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function focusOnInputField() {
  const inputField = document.querySelector(".input-Field");
  inputField.focus();
}
