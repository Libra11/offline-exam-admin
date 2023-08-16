/*
 * @Author: Libra
 * @Date: 2023-08-16 14:24:09
 * @LastEditors: Libra
 * @Description:
 */
declare module "myTypes" {
  interface ClientItem {
    ip: string;
    os: string;
    seatNum: number;
    useStatus: "free" | "used";
    onlineStatus: "online" | "offline" | "launched";
    version: string;
  }
}
