/*
 * @Description:
 * @Autor: wang chao
 * @Date: 2020-06-18 12:35:45
 * @LastEditors: dong jun hua
 * @LastEditTime: 2020-06-18 13:01:12
 */

import { Loading } from "element-ui";
let loading;
let loadCount = 0;
export function startLoading() {
  if (loadCount === 0) {
    const target = document.querySelector(".app-main");
    const background = target ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)";
    //使用Element loading-start 方法
    loading = Loading.service({
      target,
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background,
    });
  }
  loadCount++;
}
export function endLoading() {
  //使用Element loading-close 方法
  loadCount--;
  if (loadCount <= 0) {
    loading.close();
  }
}
