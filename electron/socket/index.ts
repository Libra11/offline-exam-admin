/*
 * @Author: Libra
 * @Date: 2023-05-16 17:12:25
 * @LastEditTime: 2023-06-15 10:43:07
 * @LastEditors: Libra
 * @Description:
 */
import { Server } from "socket.io";
import { server_websocket_port } from "../config";
import { updateClientInfo } from "../arp";
import { WebContents } from "electron";

let io: Server | null = null;

const createSocket = (webContents: WebContents) => {
  if (io) return;
  io = new Server({
    /* options */
  });

  io.on("connection", socket => {
    console.log("socket connected", socket.id);
    // updateClientInfo
    updateClientInfo(socket.handshake.query, webContents, "online");
    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
      updateClientInfo(socket.handshake.query, webContents, "offline");
    });
    socket.on("message", message => {
      console.log("socket message", message);
      webContents.send("message", JSON.stringify(message));
    });
  });
  io.listen(server_websocket_port);
};
export default createSocket;
