/*
 * @Author: Libra
 * @Date: 2023-06-14 14:43:30
 * @LastEditors: Libra
 * @Description:
 */
import { db } from "@/db/client";
import { ClientItem } from "@electron/arp";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { defineStore } from "pinia";

export const useClientStore = defineStore({
  id: "pure-client",
  state: () => ({
    data: Array<ClientItem>(),
    allClientNum: 0,
    onlineClientNum: 0
  }),
  actions: {
    async insertData(data: ClientItem) {
      try {
        await db.clients.add(data);
      } catch (error) {
        console.error(error);
      }
    },

    async getAllData() {
      this.data = await db.clients.toArray();
      this.allClientNum = this.data.length;
    },
    async updateData(data) {
      console.log("host-update");
      this.data.map((item: ClientItem) => {
        if (item.ip === data.ip) {
          item.onlineStatus = data.onlineStatus;
          item.version = data.version;
        }
        return item;
      });
      this.onlineClientNum = this.data.filter(
        (item: ClientItem) => item.onlineStatus === "online"
      ).length;
      // update db
      db.clients.update(data.ip, data);
    }
  }
});

export const clientStore = useClientStore();
ipcRenderer.on("host-update", (event: IpcRendererEvent, arg: string) => {
  clientStore.updateData(JSON.parse(arg));
});
