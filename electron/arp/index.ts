/*
 * @Author: Libra
 * @Date: 2023-05-17 09:44:22
 * @LastEditTime: 2023-06-09 15:17:28
 * @LastEditors: Libra
 * @Description: dgram udp
 */
import { getLocalIpAddress } from "../util";
import io from "socket.io-client";
import { client_websocket_port } from "../config";
import type { WebContents } from "electron";
import { MessageType } from "../../src/enum";
import find, { IDevice } from "local-devices";

interface Host {
  ip: string;
  localIP: string;
}

interface ClientItem {
  id: string;
  ip: string;
  status: "online" | "offline" | "launched";
  version: string;
}

const hosts = new Map<string, ClientItem>();

export function updateHostsInfo(data: ClientItem, webContents: WebContents) {
  // TODO: update single host instead of all hosts, send map instead of array
  hosts.set(data.ip, data);
  webContents.send("host", JSON.stringify(data));
}
export function getHostById(id: string) {
  return Array.from(hosts.values()).find(item => item.id === id);
}

function discoverHosts(webContents: WebContents, ipObj: any) {
  const localIP = getLocalIpAddress();
  if (!localIP) return;
  const subnet = ipObj.first + "." + ipObj.second + "." + ipObj.third;
  find({
    address: `${subnet}.${ipObj.fourthStart}-${subnet}.${ipObj.fourthEnd}`
  }).then((devices: Array<IDevice>) => {
    devices.forEach((device: IDevice) => {
      const host: Host = { ip: device.ip, localIP };
      hosts.set(device.ip, {
        id: "",
        ip: device.ip,
        status: "offline",
        version: ""
      });
      notifyHosts(host);
    });
    // webContents.send("hosts", JSON.stringify(Array.from(hosts.values())));
    webContents.send("hosts", JSON.stringify(Object.fromEntries(hosts)));
  });
}

// function discoverHosts(webContents: WebContents, ipObj: any) {
//   const localIP = getLocalIpAddress();
//   if (!localIP) return;
//   const subnet = ipObj.first + "." + ipObj.second + "." + ipObj.third;
//   for (let i = ipObj.fourthStart; i <= ipObj.fourthEnd; i++) {
//     const ip = subnet + "." + i;
//     arp.getMAC(ip, (err: string, mac: string) => {
//       if (!err && mac) {
//         const host: Host = { ip, localIP };
//         hosts.set(ip, {
//           id: "",
//           ip,
//           status: "offline",
//           version: ""
//         });
//         if (hosts.size === ipObj.fourthEnd - ipObj.fourthStart + 1) {
//           webContents.send("hosts", JSON.stringify(Array.from(hosts.values())));
//         }
//         notifyHosts(host);
//       } else {
//         console.log("err", err);
//       }
//     });
//   }
// }

function notifyHosts(host: Host) {
  const socket = io(`http://${host.ip}:${client_websocket_port}`);
  const msg = {
    type: MessageType.ADMIN_CONNECT,
    data: {
      serverIp: host.localIP,
      localIp: host.ip
    }
  };
  socket.on("error", err => {
    console.log("socket error", err);
  });
  socket.on("connect", () => {
    socket.emit("message", msg);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
}
export { discoverHosts };
