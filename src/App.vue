<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { remote } from "electron";
const log = require("electron-log");
export default {
  data() {
    return {
      timer: null,
    };
  },
  created() {
    log.info("启动客户端");
    remote.crashReporter.start({
      submitURL: "http://114.96.104.203:9000/viewLog",
      compress: true,
    });
    this.timer = setInterval(() => {
      this.$notify({
        title: "休息提醒",
        message: "工作再忙也要注意眼部休息哦 ^_^ !",
        type: "warning",
      });
    }, 10800000);
  },
  //   mounted() {
  //     this.$nextTick(() => {
  //       //   document.addEventListener("keydown", function (e) {
  //       //     // alert("您按下的按钮的keyCode为：" + e.keyCode);
  //       //     console.log(e.keyCode);
  //       //     console.log(e.altKey);
  //       //     // if (e.keyCode)
  //       //   });
  //       document.onkeydown = (e) => {
  //         let keyCode = e.keyCode || e.which || e.charCode;
  //         let shiftKey = e.shiftKey;
  //         if (shiftKey && keyCode === 37) {
  //           this.devetoolp();
  //         }
  //       };
  //     });
  //   },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
    alert(123);
  },
  //   methods: {
  //     devetoolp() {
  //       ipcRenderer.send("devtool");
  //     },
  //   },
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#app {
  background-color: #f7f7f7;
  font-family: PingFangSC-Medium;
}
/* 滚动条美化 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/
::-webkit-scrollbar-track {
  width: 8px;
  background-color: #fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条的设置*/
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条移上去的背景*/
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
