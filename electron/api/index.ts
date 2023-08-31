/*
 * @Author: Libra
 * @Date: 2023-08-28 15:31:09
 * @LastEditors: Libra
 * @Description:
 */
import { updateClientInfo } from "../arp";

const handleApi = (message, callback, socket, webContents) => {
  // message.url
  switch (message.url) {
    case "/api/update/client/status":
      updateClientInfo(
        socket.handshake.query,
        webContents,
        message.query.onlineStatus
      );
      callback({
        code: 200,
        data: "success",
        message: "更改客户端状态成功"
      });
  }
};
export default handleApi;
