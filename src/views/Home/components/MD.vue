<template>
  <div class="md">
    <div id="editorSection"></div>
  </div>
</template>

<script>
import Editor from "@toast-ui/editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import uml from "@toast-ui/editor-plugin-uml";
import chart from "@toast-ui/editor-plugin-chart";
import { ipcRenderer, remote } from "electron";
const fs = require("fs");

export default {
  name: "MD",
  props: {
    mdValue: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      mdStr: "",
      htmlStr: "",
    };
  },
  mounted() {
    this._INIT();
  },
  methods: {
    _INIT() {
      this.$nextTick(() => {
        this.editor = new Editor({
          el: document.querySelector("#editorSection"),
          initialEditType: "markdown",
          initialValue: this.mdValue,
          previewStyle: "vertical",
          language: "zh-CN",
          height: "100%",
          viewer: false,
          plugins: [
            chart,
            codeSyntaxHighlight,
            colorSyntax,
            tableMergedCell,
            uml,
          ],
        });
        if (this.mdValue) {
          this.editor.moveCursorToEnd();
        }
        this.sub();
        this.upload();
        this.down();
      });
    },
    sub() {
      this.editor.insertToolbarItem(
        { groupIndex: 0, itemIndex: 0 },
        {
          name: "myItem",
          tooltip: "点击操作完成编辑",
          // command: 'bold',
          text: "提 交",
          className: "toastui-editor-toolbar-icons first",
          style: {
            backgroundImage: "none",
            width: "60px",
            boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
            color: "#67c23a",
          },
        }
      );
      const sub = document.querySelector(".first");
      sub.addEventListener("click", () => {
        this.mdStr = this.editor.getMarkdown();
        this.htmlStr = this.editor.getHTML();
        if (!this.mdStr) {
          this.$message.error("请先编辑内容再操作!");
          return;
        }
        this.$emit("md-sub", {
          md: this.mdStr,
          html: this.htmlStr,
          msg: false,
        });
      });
    },
    upload() {
      this.editor.insertToolbarItem(
        { groupIndex: 0, itemIndex: 1 },
        {
          name: "myItem",
          tooltip: "导入MD文件",
          // command: 'bold',
          text: "导 入",
          className: "toastui-editor-toolbar-icons upload",
          style: {
            backgroundImage: "none",
            width: "60px",
            boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
          },
        }
      );
      const upload = document.querySelector(".upload");
      upload.addEventListener("click", () => {
        remote.dialog
          .showOpenDialog({
            properties: ["openFile"],
          })
          .then((dir) => {
            //通过fs模块读取文件内容
            const value = fs.readFileSync(dir.filePaths[0]).toString();
            this.editor.insertText(value);
            //将fs模块中读取的内容渲染到文本输入框
          });
      });
    },
    down() {
      this.editor.insertToolbarItem(
        { groupIndex: 0, itemIndex: 2 },
        {
          name: "myItem",
          tooltip: "输入内容以MD格式存储至本地桌面",
          // command: 'bold',
          text: "导 出",
          className: "toastui-editor-toolbar-icons down",
          style: {
            backgroundImage: "none",
            width: "60px",
            boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
          },
        }
      );
      const upload = document.querySelector(".down");
      upload.addEventListener("click", () => {
        this.mdStr = this.editor.getMarkdown();
        this.htmlStr = this.editor.getHTML();
        if (!this.mdStr) {
          this.$message.error("请先编辑内容再操作!");
          return;
        }
        this.open(this.mdStr);
      });
    },
    open(mdStr) {
      this.$confirm("当前内容将以md格式存储至本地桌面，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const msg = await ipcRenderer.sendSync("saveFile", [
            this.name,
            mdStr,
          ]);
          if (msg.status) {
            this.$message.success(msg.msg);
          } else {
            this.$message.error(msg.msg);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.md {
  height: calc(100vh - 146px);
  padding-top: 20px;
  #editorSection {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .first,
    .upload,
    .down {
      padding: 0 10px;
      border: 1px solid #f99;
    }
  }
}
</style>
