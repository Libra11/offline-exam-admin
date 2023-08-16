/*
 * @Author: Libra
 * @Date: 2023-05-30 10:44:24
 * @LastEditTime: 2023-07-21 17:03:27
 * @LastEditors: Libra
 * @Description:/*
 */
import path from "path";
import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  Menu,
  nativeTheme,
  powerSaveBlocker
} from "electron";
import { discoverHosts, sendLocalIptoClient } from "./arp/index";
import createSocket from "./socket";

const isDev = process.env.VITE_DEV_SERVER_URL;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
powerSaveBlocker.start("prevent-display-sleep");
let win: BrowserWindow | null = null;
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 2200,
    height: 1200,
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
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

// dark mode
ipcMain.on("setDarkMode", (event: IpcMainEvent, arg: boolean) => {
  nativeTheme.themeSource = arg ? "dark" : "light";
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
