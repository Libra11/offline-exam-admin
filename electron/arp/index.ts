/*
 * @Author: Libra
 * @Date: 2023-05-17 09:44:22
 * @LastEditTime: 2023-06-15 10:22:45
 * @LastEditors: Libra
 * @Description: arp
 */
import { getLocalIpAddress } from "../util";
import io, { Socket } from "socket.io-client";
import { client_websocket_port } from "../config";
import { type WebContents } from "electron";
import { MessageType } from "../../src/enum";
import find, { IDevice } from "local-devices";

const sockets = new Map<string, Socket>();

interface Host {
  ip: string;
  localIP: string;
}

export interface ClientItem {
  ip: string;
  os: string;
  seatNum: number;
  useStatus: "free" | "used";
  onlineStatus: "online" | "offline" | "launched";
  version: string;
}

function discoverHosts(webContents: WebContents, ipObj: any) {
  const localIP = getLocalIpAddress();
  if (!localIP) return;
  const subnet = ipObj.first + "." + ipObj.second + "." + ipObj.third;
  find({
    address: `${subnet}.${ipObj.fourthStart}-${subnet}.${ipObj.fourthEnd}`,
    skipNameResolution: true
  }).then((devices: Array<IDevice>) => {
    devices.forEach((device: IDevice) => {
      const host: Host = { ip: device.ip, localIP };
      notifyClients(host, webContents);
    });
  });
}

export function sendLocalIptoClient(localIp: string, clients: Array<string>) {
  clients.forEach(ip => {
    const socket = sockets.get(ip);
    socket &&
      socket.emit("message", {
        type: MessageType.ADMIN_CONNECT,
        data: {
          serverIp: localIp,
          localIp: ip
        }
      });
  });
}

function notifyClients(host: Host, webContents: WebContents) {
  const socket = io(`http://${host.ip}:${client_websocket_port}`);
  socket.on("error", err => {
    console.log("socket error", err);
  });
  socket.on("connect", () => {
    console.log("socket connected");
    // disconnect old socket if exists
    const oldSocket = sockets.get(host.ip);
    oldSocket && oldSocket.disconnect();
    sockets.set(host.ip, socket);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
  socket.on("message", message => {
    console.log(message);
    if (message.type === MessageType.CLIENT_STATUS) {
      const { useStatus, version, os } = message.data;
      const h: ClientItem = {
        os,
        ip: host.ip,
        seatNum: 0,
        onlineStatus: "offline",
        version,
        useStatus: useStatus
      };
      webContents.send("host", JSON.stringify(h));
    }
  });
}

export function updateClientInfo(
  data: any,
  webContents: WebContents,
  onlineStatus: string
) {
  const { ip, version } = data;
  const clientInfo = {
    ip,
    onlineStatus,
    version
  };
  webContents.send("host-update", JSON.stringify(clientInfo));
}
export { discoverHosts };
