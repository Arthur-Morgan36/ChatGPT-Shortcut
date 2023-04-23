// main.js
const API_KEY = "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";

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: API_KEY,
  })
);

const KEYS = {
  F12: "f12",
  ESC: "escape",
  ENTER: "enter",
};

function createWindow() {
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
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("src/index.html");

  // todo: remove after testing
  // mainWindow.webContents.openDevTools();

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

    if (inp.key.toLowerCase() === KEYS.ENTER) {
      ipcMain.on("inp", (_, data) => {
        openai
          .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: data }],
          })
          .then((res) => {
            // todo: Make it create a new window with the query and the response to the query
            console.log(res.data.choices[0].message.content);
          });
      });
      ev.sender.send("inp-done", `Data Successfully Obtained.`);
    }
  });

  const tray = new Tray(
    "C:\\Users\\Arthur Morgan\\Desktop\\Programming\\ChatGPT Shortcut\\app.ico"
  );
  const contextMenu = Menu.buildFromTemplate([
    { label: "Quit", type: "checkbox" },
    { label: "Save History", type: "checkbox" },
  ]);

  tray.setToolTip("ChatGPTio");
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  tray.on("mouse-move", () => {
    if (contextMenu.items[0].checked) app.quit();
  });

  tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow();

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
