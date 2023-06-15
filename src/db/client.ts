/*
 * @Author: Libra
 * @Date: 2023-06-13 16:40:44
 * @LastEditors: Libra
 * @Description:
 */
import Dexie, { Table } from "dexie";
import { ClientItem } from "@electron/arp";

export class Clients extends Dexie {
  clients!: Table<ClientItem>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      clients: "ip"
    });
  }
}

export const db = new Clients();
