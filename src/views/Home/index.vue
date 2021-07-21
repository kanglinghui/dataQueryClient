<template>
  <div class="home-md">
    <div class="left-menu" v-show="!mdStatus && !htmlShow">
      <el-input
        v-model="value"
        clearable
        @input="getData"
        @clear="clear"
        style="width: 190px; margin: 10px 0 10px 5px"
        placeholder="请输入表名或字段名进行搜索"
      ></el-input>
      <el-menu
        :default-active="activeIdx"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="overflow-y: auto; height: calc(100vh - 48px); border-right: 0"
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.id"
          :index="item.id + ''"
          @click="handler(item)"
        >
          <div slot="title">
            <el-tooltip
              placement="right"
              :disabled="item.tableName.length < 14"
            >
              <div slot="content">
                中文表名：{{ item.tableName }}<br />英文表名：{{
                  item.EnTableName
                }}
              </div>

              <span style="font-size: 12px"
                >{{
                  item.tableName.length > 13
                    ? item.tableName.slice(0, 13) + "..."
                    : item.tableName
                }}<i
                  style="margin-left: 5px"
                  v-if="item.tableName.length < 14"
                  >{{ item.EnTableName }}</i
                ></span
              >
            </el-tooltip>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div :class="!mdStatus && !htmlShow ? 'right-main' : 'detail'">
      <div v-if="!mdStatus && !htmlShow">
        <div class="header">
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-left: 20px"
            @click="add"
            >新 建</el-button
          >
          <el-button
            icon="el-icon-refresh"
            style="margin-left: 20px"
            @click="rest"
            plain
            >刷 新</el-button
          >
        </div>
        <div class="main">
          <el-table
            :data="tableData"
            height="calc(100vh - 178px)"
            stripe
            border
            style="width: 100%"
          >
            <el-table-column
              prop="tableName"
              align="center"
              label="表中文名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="EnTableName"
              align="center"
              label="表名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新日期"
              align="center"
              width="120"
            >
              <template v-slot:default="scope">
                <span>{{
                  moment(scope.row.updateTime).format("YYYY-MM-DD")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="描述"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column width="130px" align="center" label="操作">
              <template v-slot:default="scope">
                <el-link
                  @click="editor(scope.row)"
                  style="margin-right: 5px"
                  type="info"
                  >编辑</el-link
                >
                <el-link
                  @click="toView(scope.row)"
                  style="margin-right: 5px"
                  type="primary"
                  >查看</el-link
                >
                <el-link @click="del(scope.row)" type="danger">删除</el-link>
                <!-- <el-button @click="editor(scope.row)" type="primary"
                  >编 辑</el-button
                >
                <el-button @click="toView(scope.row)" plain>查 看</el-button>
                <el-button @click="del(scope.row)" type="danger" plain
                  >删 除</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="back" v-else>
        <div>
          <el-button class="btn-back" icon="el-icon-back" plain @click="back"
            >返 回</el-button
          >
          <el-button
            class="btn-back"
            v-show="htmlShow"
            type="primary"
            plain
            icon="el-icon-edit"
            style="margin-left: 20px"
            @click="editor(viewParams)"
            >编 辑</el-button
          >
        </div>
        <div class="topTitle">
          {{ `${topTitle.tableName}（${topTitle.EnTableName}）` }}
        </div>
      </div>
      <MDUI
        :mdValue="mdStr"
        :name="fileName"
        @md-sub="mdSubmit($event)"
        v-if="mdStatus"
      />
      <div class="dialog">
        <addDialogUI
          ref="addDialog"
          @edit="addEdit($event)"
          @sub="addSub($event)"
        />
      </div>
      <ViewUI :dataValue="viewData" v-if="htmlShow" />
    </div>
  </div>
</template>

<script>
import MDUI from "./components/MD.vue";
import addDialogUI from "./components/Add.vue";
import ViewUI from "./components/View.vue";
// import quickDB from "@/utils/quickDB";
import { add, query, update, del } from "@/api";
// import { debounce } from "@/utils/index.js";
const moment = require("moment");
// const db = new quickDB();
export default {
  name: "Login",
  components: { MDUI, addDialogUI, ViewUI },
  data() {
    return {
      value: "",
      mdStatus: false,
      list: [],
      tableData: [],
      htmlShow: false,
      viewData: null,
      mdStr: "",
      addParams: null,
      tableIdx: 0,
      id: null,
      moment: moment,
      fileName: "数据" + moment().format("YYYY-MM-DD"),
      loading: false,
      activeIdx: undefined,
      menuList: [],
      viewParams: null,
      topTitle: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.query();
      this.getData();
    },
    add() {
      this.$refs.addDialog.title = "新增";
      this.$refs.addDialog.form = {
        tableName: "",
        name: "",
        EnTableName: "",
      };
      this.$refs.addDialog.dialogShow = true;
    },
    rest() {
      this.value = "";
      this.activeIdx = undefined;
      this.query();
    },
    getData() {
      query({ tableName: this.value }).then((json) => {
        this.menuList = json.list;
        if (!this.value) {
          this.activeIdx = undefined;
        }
        if (!this.value && this.tableData.length < json.list.length) {
          this.tableData = json.list;
        }
      });
    },
    clear() {
      this.activeIdx = undefined;
      this.query();
    },
    handler(data) {
      //左侧栏点击
      this.value = data.tableName;
      this.tableData = [data];
      this.activeIdx = data.id + "";
    },
    mdSubmit(val) {
      //md编辑成功回调
      let { md, html } = val;
      update({ id: this.addParams.id, md, html }).then(() => {
        this.query();
        this.mdStatus = false;
        if (val.msg) {
          this.$message.success("编辑成功!");
        }
      });
      //   new quickDB()
      //     .updateTable(this.id, {
      //       ...val,
      //       filterStr: this.addParams.tableName + val.md,
      //     })
      //     .then((res) => {
      //       console.log(res);
      //       this.query();
      //       this.mdStatus = false;
      //       if (val.msg) {
      //         this.$message.success("编辑成功!");
      //       }
      //     });
    },
    addEdit(e) {
      this.mdStr = "";
      update({ id: this.id, ...e }).then(() => {
        this.query();
        this.$message.success("更新成功!");
      });
    },
    addSub(e) {
      //新建成功回调
      this.mdStr = "";
      add({ ...e }).then((json) => {
        this.value = "";
        this.query();
        this.getData();
        this.addParams = json.list;
        this.mdStatus = true;
        this.$message.success("新建成功");
      });
      //   new quickDB()
      //     .addMessage({
      //       Id: id,
      //       filterStr: e.tableName,
      //       ...e,
      //     })
      //     .then(() => {
      //       this.value = "";
      //       this.query();
      //       this.addParams = e;
      //       this.mdStatus = true;
      //       this.$message.success("新建成功");
      //     });
    },
    toView(row) {
      this.viewParams = row;
      //查看html
      if (!row.md) {
        this.$message.error("请先编辑markdown文件内容后再查看");
        return;
      }
      this.topTitle = row;
      this.viewData = row.md;
      this.htmlShow = true;
    },
    editor(row) {
      //编辑md
      this.topTitle = row;
      this.id = row.id;
      this.fileName = row.tableName + "_" + this.moment().format("YYYY-MM-DD");
      this.addParams = row;
      this.mdStr = row.md ? row.md : "";
      this.$refs.addDialog.title = "修改";
      this.$refs.addDialog.dialogShow = true;
      this.$refs.addDialog.form = {
        tableName: this.addParams.tableName,
        name: this.addParams.name,
        EnTableName: this.addParams.EnTableName,
      };
      this.mdStatus = true;
      this.htmlShow = false;
    },
    query() {
      //查询
      query({ tableName: this.value }).then((json) => {
        this.tableData = json.list;
      });
      //   this.loading = true;
      //   db.getStrFilter(this.value)
      //     .then((res) => {
      //       console.log(res, "res");
      //       this.tableData = res;
      //       this.loading = false;
      //     })
      //     .catch(() => (this.loading = false));
    },
    del(row) {
      this.$confirm(`此操作将删除《${row.tableName}》表, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del({ id: row.id }).then(() => {
            this.$message.success("删除成功");
            this.query();
          });
        })
        .catch(() => {});
    },
    back() {
      //返回操作
      this.htmlShow = false;
      this.mdStatus = false;
    },
  },
};
</script>
<style lange="scss">
.el-menu-item,
.el-submenu__title {
  height: 28px !important;
  line-height: 28px !important;
}
</style>
<style lang="scss" scoped>
.home-md {
  padding: 20px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  min-height: calc(100vh - 40px);
  .left-menu {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: rgb(84, 92, 100);
    border-right: 1px solid #e6e6e6;
  }
  .right-main {
    width: calc(100vw - 240px);
    margin-left: 220px;
  }
  .detail {
    margin: 0 20px;
    width: calc(100vw - 40px);
  }
  .header {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px 10px;
    border-radius: 4px;
    margin-bottom: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .main {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.back {
  height: 66px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 15px;
  display: flex;
  i {
    cursor: pointer;
    font-size: 36px;
    line-height: 66px;
    margin-right: 10px;
  }
  .btn-back {
    height: 30px;
    margin-top: 18px;
    line-height: 5px;
  }
}
.topTitle {
  line-height: 66px;
  text-align: center;
  width: calc(100vw - 260px);
}
</style>
