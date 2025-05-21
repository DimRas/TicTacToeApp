const { remote } = require("electron");

document.getElementById("closeBtn").addEventListener("click", () => {
  window.close();
});

document.getElementById("minimizeBtn").addEventListener("click", () => {
  remote.getCurrentWindow().minimize();
});

document.getElementById("maximizeBtn").addEventListener("click", () => {
  const currentWindow = remote.getCurrentWindow();
  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
  } else {
    currentWindow.maximize();
  }
});
