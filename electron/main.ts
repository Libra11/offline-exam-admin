/*
 * @Author: Libra
 * @Date: 2023-05-30 10:44:24
 * @LastEditTime: 2023-06-15 14:54:04
 * @LastEditors: Libra
 * @Description:/*
 */
import path from "path";
import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  powerSaveBlocker
} from "electron";
import { discoverHosts, sendLocalIptoClient } from "./arp/index";
import createSocket from "./socket";
import os from "os";

const isDev = process.env.VITE_DEV_SERVER_URL;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
powerSaveBlocker.start("prevent-display-sleep");
let win: BrowserWindow | null = null;
function createWindow() {
  // Menu.setApplicationMenu(null);
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
}

app.whenReady().then(() => {
  createWindow();
  console.log(os.release());
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("find-clients", (event: IpcMainEvent, ip: string) => {
  if (!win) return;
  discoverHosts(win.webContents, JSON.parse(ip));
});

ipcMain.on("connect-clients", (event: IpcMainEvent, arg: string) => {
  const { localIp, clients } = JSON.parse(arg);
  sendLocalIptoClient(localIp, clients);
});

ipcMain.on("create-server", () => {
  createSocket(win.webContents);
});
