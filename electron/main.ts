/*
 * @Author: Libra
 * @Date: 2023-05-30 10:44:24
 * @LastEditTime: 2023-06-12 09:46:50
 * @LastEditors: Libra
 * @Description:/*
 */
import path from "path";
import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
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

ipcMain.on("connectAllClient", (event: IpcMainEvent, ip: string) => {
  if (!win) return;
  discoverHosts(win.webContents, JSON.parse(ip));
});
