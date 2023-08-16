/*
 * @Author: Libra
 * @Date: 2023-06-13 16:40:44
 * @LastEditors: Libra
 * @Description:
 */
import { ClientItem } from "myTypes";
import db from ".";
import { IndexableType } from "dexie";
interface Clients {
  getAllClient(): Promise<ClientItem[]>;
  addClient(client: ClientItem): Promise<IndexableType>;
  updateClient(client: ClientItem): Promise<IndexableType>;
}
const clients: Clients = {
  async getAllClient() {
    return db.clients.toArray();
  },
  async addClient(client: ClientItem) {
    return db.clients.add(client);
  },
  async updateClient(client: ClientItem) {
    return db.clients.update(client.ip, client);
  }
};
export default clients;
