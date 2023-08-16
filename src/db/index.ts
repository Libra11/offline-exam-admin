/*
 * @Author: Libra
 * @Date: 2023-08-16 14:48:18
 * @LastEditors: Libra
 * @Description:
 */
import Dexie, { IndexableType } from "dexie";
import { ClientItem } from "myTypes";

interface MyDatabase extends Dexie {
  clients: Dexie.Table<ClientItem, IndexableType>;
}

const db = new Dexie("myDatabase") as MyDatabase;

db.version(1).stores({
  clients: "ip"
});

export default db;
