const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const SERVER_URL = require(path.join(__dirname, "config"));
const PY_MODULE = "app";

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_MODULE);
  return require("fs").existsSync(fullPath);
};

const createWindow = () => {
  const options = {
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  };
  const window = new BrowserWindow(options);
  window.loadFile("index.html");
  window.webContents.openDevTools();
  if (guessPackaged()) {
    pyProc = require("child_process").execFile(path.join(__dirname, PY_MODULE));
  } else {
    pyProc = require("child_process").spawn("python", [
      path.join(__dirname, `${PY_MODULE}.py`),
    ]);
  }

  ipcMain.on("file-request", event => {
    const files = dialog.showOpenDialogSync(window);

    // Check if the user selected a file
    if (files && files.length > 0) {
      const imagePath = files[0];
      const imageContent = require("fs")
        .readFileSync(imagePath)
        .toString("base64");
      window.webContents.send("imageFile", {
        path: imagePath,
        content: imageContent,
      });
    } else {
      // Handle the case when the user cancels the file dialog
      console.log("User canceled file selection");
    }
  });

  ipcMain.on("weight-request", event => {
    const files = dialog.showOpenDialogSync(window);

    // Check if the user selected a file
    if (files && files.length > 0) {
      const weightPath = files[0];
      console.log(`weight request path: ${weightPath}`)
      axios
        .post(`${SERVER_URL}/process/weight`, { weightFile: weightPath })
        .then(response => {
          console.log(`weight request log: ${response}`);
          // Handle the response
        })
        .catch(error => {
          console.log(`weight request error: ${error}`);
          // Handle errors
        });
    } else {
      // Handle the case when the user cancels the file dialog
      console.log("User canceled file selection");
    }
  });

  window.on("closed", () => {
    win = null;
    app.quit();
    console.log("app closed");
    pyProc.kill();
    console.log("python server closed");
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

try {
  require("electron-reloader")(module);
} catch (_) {}
