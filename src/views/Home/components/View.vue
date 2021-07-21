<template>
  <div class="main-view">
    <div class="view-main">
      <!-- <div class="title">
        {{ name.tableName + '（' + name.EnName + ')' }}
      </div> -->
      <!-- <div class="view-content" v-html="dataValue"></div> -->
      <div id="view-content"></div>
    </div>
  </div>
</template>
<script>
import Editor from "@toast-ui/editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import uml from "@toast-ui/editor-plugin-uml";
import chart from "@toast-ui/editor-plugin-chart";

export default {
  props: {
    dataValue: {
      type: String,
      default: "",
    },
    // name: {
    //   type: Object,
    //   default() {
    //     return null
    //   },
    // },
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const chartOptions = {
        minWidth: 200,
        maxWidth: 1200,
        minHeight: 100,
        maxHeight: 600,
      };

      this.editor = Editor.factory({
        el: document.querySelector("#view-content"),
        initialEditType: "wysiwyg",
        initialValue: this.dataValue,
        previewStyle: "vertical",
        language: "zh-CN",
        height: "calc(100vh - 110px)",
        viewer: true,
        plugins: [
          [chart, chartOptions],
          codeSyntaxHighlight,
          //   colorSyntax,
          tableMergedCell,
          uml,
        ],
        // events: {
        //   focus: () => {
        //     this.focus()
        //   },
        // },
        hideModeSwitch: true,
        toolbarItems: [],
      });
      //   this.editor.insertToolbarItem(
      //     { groupIndex: 0, itemIndex: 0 },
      //     {
      //       name: 'myItem',
      //       tooltip: '返回至主页面',
      //       // command: 'bold',
      //       text: '返 回',
      //       className: 'toastui-editor-toolbar-icons back',
      //       style: {
      //         backgroundImage: 'none',
      //         width: '60px',
      //         boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      //         color: '#606266',
      //         backgroundColor: '#fff',
      //         marginLeft: '0',
      //       },
      //     }
      //   )
      //   const back = document.querySelector('.back')
      //   back.addEventListener('click', () => {
      //     this.$emit('back')
      //   })
      //   this.editor.blur()
      const tableArray = document.querySelectorAll("table");
      tableArray.forEach((item) => {
        const div = document.createElement("div");
        div.className = "scroll-x";
        item.parentNode.replaceChild(div, item);
        div.append(item);
        console.log(div);
      });
    });
  },
  methods: {
    focus() {
      this.editor.blur();
    },
  },
};
</script>
<style lang="scss">
.main-view {
  width: 100%;
  margin-top: 10px;
  height: calc(100vh - 116px);
  font-family: PingFangSC-Medium;
  .view-main {
    width: 100%;
    // margin-top: 20px;
    background-color: #fff;
    // border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.01);
    .view-content {
      //   width: calc(100vw - 80px);
      padding: 0 15px;
      height: 100vh;
      margin: 0 auto;
      overflow: hidden;
      overflow-x: auto;
      //   overflow-y: auto;
    }
    .title {
      position: absolute;
      top: 0;
      left: 108px;
      z-index: 999;
      line-height: 50px;
      font-size: 15px;
      width: calc(100vw - 190px);
      margin-left: 10px;
      text-align: center;
      color: #303133;
      font-family: PingFangSC-Medium;
      font-weight: 300;
    }
    #view-content {
      height: calc(100vh - 110px);
      overflow: auto;
    }
    .toastui-editor-contents {
      padding: 10px;
    }
    .toastui-editor-defaultUI .ProseMirror {
      padding: 18px 10px;
    }
    .toastui-editor-defaultUI-toolbar {
      padding: 0 10px;
    }
    .toastui-editor-defaultUI {
      border: 0;
    }
    .toastui-chart-wrapper {
      overflow: auto;
    }
    // h1 {
    //   color: #000;
    //   padding: 0;
    //   margin: 0;
    //   line-height: 42px;
    //   font-size: 38px;
    //   padding: 10px 0;
    // }
    // h2 {
    //   color: #000;
    //   padding: 0;
    //   margin: 0;
    //   font-size: 34px;
    //   line-height: 38px;
    //   padding: 10px 0;
    // }
    // h3 {
    //   color: #000;
    //   padding: 0;
    //   margin: 0;
    //   font-size: 30px;
    //   line-height: 34px;
    //   padding: 10px 0;
    // }
    // h4 {
    //   color: #000;
    //   font-size: 24px;
    //   padding: 0;
    //   margin: 0;
    //   line-height: 28px;
    //   padding: 10px 0;
    // }
    // h5 {
    //   color: #000;
    //   padding: 0;
    //   margin: 0;
    //   font-size: 20px;
    //   line-height: 38px;
    //   padding: 10px 0;
    // }
    // h6 {
    //   color: #000;
    //   padding: 0;
    //   font-size: 18px;
    //   margin: 0;
    //   line-height: 26px;
    //   padding: 10px 0;
    // }
    // p {
    //   color: #303133;
    //   font-size: 13px;
    //   line-height: 20px;
    // }
    // strong {
    //   color: #303133;
    //   font-size: 13px;
    // }
    // span {
    //   color: #606266;
    //   font-size: 13px;
    // }
    // s {
    //   color: #606266;
    // }
    // i {
    //   color: #606266;
    // }
    // ol,
    // ul {
    //   padding-left: 17px;
    //   font-size: 13px;
    // }
    // li::marker {
    //   color: #409eff;
    // }
    // a {
    //   font-size: 13px;
    //   color: #409eff;
    // }
    // code {
    //   background-color: #262729;
    //   color: rgb(77, 200, 175);
    //   line-height: 20px;
    //   padding: 0 15px;
    //   display: block;
    //   margin-top: 10px;
    // }
    // hr {
    //   margin: 15px 0;
    //   border: 1px solid #ebeef5;
    // }
    // blockquote {
    //   margin: 14px 0;
    //   font-size: 13px;
    //   border-left: 4px solid #e5e5e5;
    //   padding: 0 16px;
    //   color: #999;
    // }
    .scroll-x {
      width: 100%;
      overflow: auto;
      background-color: #fff;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      margin-bottom: 0;
      //   border-spacing: 0;
      //   border-top: 1px solid #ebeef5;
      //   border-right: 1px solid #ebeef5;
      //   font-family: PingFangSC-Medium;
      //   overflow: hidden;
      //   thead {
      //     background-color: #f5f7fa;
      //     color: #999;
      //     font-family: PingFangSC-Medium;
      //     tr {
      //       &:hover {
      //         background-color: #f5f7fa;
      //       }
      //     }
      //   }
      //   thead,
      //   tbody {
      //     width: 100%;
      //   }
      th,
      td {
        //     color: #606266;
        white-space: nowrap;
        padding: 10px;
        font-size: 12px;
        //     line-height: 14px;
        text-align: center;
        //     border: 1px solid #ebeef5;
        //     border-right: 0;
        //     border-top: 0;
        //     font-family: PingFangSC-Medium;
      }
      //   th {
      //     color: #909399;
      //     font-weight: 600;
      //   }
      tr:nth-of-type(even) {
        background: #f4f4f5;
      }
      tr {
        transition: 0.5s;
        &:hover {
          background-color: #f2f6fc;
        }
      }
    }
  }
}
</style>
