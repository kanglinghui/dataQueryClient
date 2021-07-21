import Dexie from "dexie";
class BaseDB {
  constructor(version = 1, DBName, table = {}) {
    this.version = version;
    this.DBName = DBName;
    this.table = table;
    this.db = null;
  }

  open() {
    this.db = new Dexie(this.DBName);
    this.db.version(this.version).stores(this.table);
    this.db.open();
    return this.db;
  }

  close() {
    this.db && this.db.close();
  }

  transaction(table, callback = () => {}, mode = "rw") {
    return this.db.transaction(
      mode,
      Array.isArray(table) ? table : [table],
      callback
    );
  }
}

export default BaseDB;
