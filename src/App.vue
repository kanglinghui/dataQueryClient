<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { remote } from "electron";

export default {
  created() {
    remote.crashReporter.start({
      submitURL: "http://114.96.104.203:9000/viewLog",
      compress: true,
    });
  },
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
