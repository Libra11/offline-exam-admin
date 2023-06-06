/*
 * @Author: Libra
 * @Date: 2023-05-16 17:12:25
 * @LastEditTime: 2023-06-05 15:52:32
 * @LastEditors: Libra
 * @Description:
 */
import { Server } from "socket.io";
import { server_websocket_port } from "../config";
import type { WebContents } from "electron";

const sockets = new Map();

const createSocket = (webContents: WebContents) => {
  const io = new Server({
    /* options */
  });

  io.on("connection", socket => {
    // ...
    console.log("socket connected", socket.id, io.engine.clientsCount);
    sockets.set(socket.id, socket.handshake.query);
    webContents.send(
      "updateSocketList",
      JSON.stringify(Array.from(sockets.values()))
    );
    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
      sockets.delete(socket.id);
      webContents.send(
        "updateSocketList",
        JSON.stringify(Array.from(sockets.values()))
      );
    });
    socket.on("message", data => {
      webContents.send("message", data);
    });
  });
  io.listen(server_websocket_port);
};
export default createSocket;
