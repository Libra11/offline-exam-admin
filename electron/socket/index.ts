/*
 * @Author: Libra
 * @Date: 2023-05-16 17:12:25
 * @LastEditTime: 2023-06-09 15:18:38
 * @LastEditors: Libra
 * @Description:
 */
import { Server } from "socket.io";
import { server_websocket_port } from "../config";
import type { WebContents } from "electron";
import { MessageType } from "../../src/enum";
import { updateHostsInfo, getHostById } from "../arp";

const createSocket = (webContents: WebContents) => {
  const io = new Server({
    /* options */
  });

  io.on("connection", socket => {
    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
      const host = getHostById(socket.id);
      host && updateHostsInfo({ ...host, status: "offline" }, webContents);
    });
    socket.on("message", message => {
      if (message.type === MessageType.CLIENT_INFO) {
        updateHostsInfo(message.data, webContents);
      }
      if (!message.type) {
        console.log("message", message);
      }
    });
  });
  io.listen(server_websocket_port);
};
export default createSocket;
