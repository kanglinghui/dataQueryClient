import BaseDB from "./baseDB";
// const db = new Dexie("md_database");
// db.version(1).stores({
//   docMessage: `&msgId,docId,userId,msgType,updates,status,createTime,updateTime`
// });

const CONFIG = {
  DBVersion: 1,
  DBName: "docMessage",
};
class AccountDB extends BaseDB {}
const DB = new AccountDB(CONFIG.DBVersion, CONFIG.DBName, {
  docMessage: `&Id,filterStr,md,name,tableName,html,status,type,createTime,updateTime`,
});
export default class DocMessage {
  constructor() {
    this.db = DB.open();
  }
  //   添加消息
  addMessage(msg) {
    const time = new Date().getTime();
    return DB.transaction(this.db.docMessage, () => {
      return this.db.docMessage.add({
        ...msg,
        status: "Y",
        type: "1",
        createTime: time,
        updateTime: time,
      });
    })
      .then(() => {
        DB.close();
      })
      .catch((error) => {
        console.log(error);
        DB.close();
      });
  }
  //    删除单条消息
  async deleteMessageByMsgId(msgId) {
    try {
      await this.db.where({ msgId }).delete();
    } catch (err) {
      console.log(err);
    }
  }
  // 更新一条状态
  updateTable(id, value) {
    console.log(value, "value");
    console.log(id);
    this.db = DB.open();
    const time = new Date().getTime();
    return DB.transaction(this.db.docMessage, () => {
      return this.db.docMessage
        .where("Id")
        .equals(id)
        .modify({
          ...value,
          updateTime: time,
        });
    })
      .then(() => {
        DB.close();
      })
      .catch((error) => {
        console.log(error);
        DB.close();
      });
  }
  // 更新多条状态
  async updateMessagesStatus(msgIds, status) {
    const time = new Date().getTime();
    try {
      await this.db.where("msgId").anyof(msgIds).modify({
        status,
        updateTime: time,
      });
    } catch (err) {
      console.log(err);
    }
  }
  // 查询某时间段某文档信息
  async filterMessagesByDocId(docId, startTime, endTime) {
    let messages = [];
    try {
      messages = await this.db
        .where({ docId })
        .and((item) => item.createTime < endTime && item.createTime > startTime) // 也可以使用above 和 below
        .toArray();
    } catch (err) {
      console.log(err);
    }
    return messages;
  }
  // 查询某文档所有的信息
  getAllMessagesByDocId(docId) {
    let messages = [];
    console.log({ docId });
    messages = this.db.docMessage
      .where({ docId })
      .sortBy("createTime")
      .toArray();
    // try {
    //   messages = await this.db.docMessage.where({ docId }).sortBy("createTime");
    // } catch (err) {
    //   console.log(err);
    // }
    return messages;
  }
  getStrFilter(str) {
    this.db = DB.open();
    return (
      this.db.docMessage
        // .where("tableName")
        // .startsWithAnyOfIgnoreCase(str)
        // .or("md")
        // .startsWithAnyOfIgnoreCase(str)
        .orderBy("filterStr")
        .filter((item) => item.filterStr.indexOf(str) !== -1)
        .reverse()
        .distinct()
        .toArray()
    );
  }
}
