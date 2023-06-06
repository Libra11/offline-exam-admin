/*
 * @Author: Libra
 * @Date: 2023-05-17 10:01:30
 * @LastEditTime: 2023-06-05 15:53:50
 * @LastEditors: Libra
 * @Description: util
 */
import os from "os";
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (!iface) continue;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
export { getLocalIpAddress };
