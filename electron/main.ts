/*
 * @Author: Libra
 * @Date: 2023-05-30 10:44:24
 * @LastEditTime: 2023-05-30 11:15:05
 * @LastEditors: Libra
 * @Description:/*
 * @Author: Libra
 * @Date: 2023-03-08 16:59:46
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /libra-vue3-all-in-one-template/electron/electron.js
 */
import path from "path";
import { app, BrowserWindow } from "electron";

const isDev = process.env.VITE_DEV_SERVER_URL;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:8848"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
