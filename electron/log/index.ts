/*
 * @Author: Libra
 * @Date: 2023-07-21 16:52:57
 * @LastEditors: Libra
 * @Description:
 */
import { ipcRenderer } from "electron";

class LogLevel {
  public static get DEBUG(): number {
    return 0;
  }
  public static get INFO(): number {
    return 1;
  }
  public static get WARN(): number {
    return 2;
  }
  public static get ERROR(): number {
    return 3;
  }
}

export default class Log {
  private level: number;

  constructor(level: number) {
    this.level = level;
  }

  public debug(...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      this.print("DEBUG", ...args);
    }
  }

  public info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      this.print("INFO", ...args);
    }
  }

  public warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      this.print("WARN", ...args);
    }
  }

  public error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      this.print("ERROR", ...args);
    }
  }

  private print(level: string, ...args: any[]): void {
    const msg = `[${level}] ${args.join(" ")}\n`;
    ipcRenderer.send("log", msg);
  }
}
