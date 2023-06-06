/*
 * @Author: Libra
 * @Date: 2023-05-30 10:44:24
 * @LastEditTime: 2023-06-05 16:11:23
 * @LastEditors: Libra
 * @Description:/*
 * @Author: Libra
 * @Date: 2023-03-08 16:59:46
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /libra-vue3-all-in-one-template/electron/electron.js
 */
import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { discoverHosts } from "./arp/index";
import createSocket from "./socket";

const isDev = process.env.VITE_DEV_SERVER_URL;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
let win: BrowserWindow | null = null;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });
  win.loadURL(
    isDev
      ? "http://localhost:8848"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  if (isDev) {
    win.webContents.openDevTools();
  }
  createSocket(win.webContents);
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

ipcMain.on("connectAllClient", () => {
  if (!win) return;
  discoverHosts(win.webContents);
});
