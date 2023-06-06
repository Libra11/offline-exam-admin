/*
 * @Author: Libra
 * @Date: 2023-05-17 09:44:22
 * @LastEditTime: 2023-06-05 16:11:49
 * @LastEditors: Libra
 * @Description: dgram udp
 */
import { getLocalIpAddress } from "../util";
import arp from "node-arp";
import io from "socket.io-client";
import { client_websocket_port } from "../config";
import type { WebContents } from "electron";

interface Host {
  ip: string;
  mac: string;
  localIP: string;
}

function discoverHosts(webContents: WebContents) {
  const localIP = getLocalIpAddress();
  if (!localIP) return;
  const subnet = localIP.split(".").slice(0, 3).join(".");
  const hosts: any = [];

  for (let i = 1; i <= 255; i++) {
    const ip = subnet + "." + i;
    arp.getMAC(ip, (err: string, mac: string) => {
      if (!err && mac) {
        const host: Host = { ip, mac, localIP };
        notifyHosts(host);
        hosts.push(host);
        if (i === 255) {
          webContents.send("hosts", JSON.stringify(hosts));
        }
      } else {
        console.log("err", err);
      }
    });
  }
}

function notifyHosts(host: Host) {
  const socket = io(`http://${host.ip}:${client_websocket_port}`);
  socket.on("connect", () => {
    socket.emit("ip", host.localIP);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
}
export { discoverHosts };
