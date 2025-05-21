const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 600,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false, // Remove default window frame
    transparent: true, // Make window transparent
    backgroundColor: "#00000000", // Transparent background
  });

  // Load the index.html file
  win.loadFile("index.html");

  // Remove menu bar
  win.setMenuBarVisibility(false);

  // Make window always on top
  win.setAlwaysOnTop(true);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
