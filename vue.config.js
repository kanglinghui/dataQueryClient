// const path = require("path");
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
const productName = "聊塑参考数据库 - 后台管理";
const devServer = {};
const proxy = {
  // detail: https://cli.vuejs.org/config/#devserver-proxy
  [process.env.VUE_APP_BASE_API]: {
    // target: `http://127.0.0.1:${port}`,
    // target: "http://47.110.127.118:8001",
    target: "http://114.96.104.203:9000",
    changeOrigin: true,
    pathRewrite: {
      ["^" + process.env.VUE_APP_BASE_API]: "",
    },
  },
};
devServer.proxy = proxy;
module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  devServer,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "字典查询系统";
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: "lead://./",
      mainProcessWatch: ["src/app"],
      builderOptions: {
        appId: "com.dictionaries.firm",
        productName,
        copyright: "Copyright©2021dictionariesData.com",
        // extraResources: {
        //   from: "./dbfile",
        //   to: "../dbfile",
        // },
        publish: [
          {
            provider: "generic",
            url: "http://localhost:9999/",
          },
        ],
        extraMetadata: {
          mian: "./build/app.js",
        },
        directories: {
          buildResources: "assets",
          output: "dist-build-" + process.env.VUE_APP_BUILD_TYPE_S, // 输出文件夹
        },
        mac: {
          category: "public.app-category.finance",
          artifactName: "dictionaries-${version}.${ext}",
        },
        dmg: {
          // background: 'public/img/launch.png',
          icon: "assets/icons/icon.icns",
          iconSize: 90,
          artifactName: "dictionaries-${version}.${ext}",
        },
        win: {
          target: ["nsis"],
          icon: "assets/icons/icon.ico",
          artifactName: "dictionaries-${version}.${ext}",
        },
        nsis: {
          allowToChangeInstallationDirectory: true,
          oneClick: false,
          perMachine: false,
        },
        linux: {
          target: ["AppImage"],
          category: "Finance",
        },
      },
    },
  },
  configureWebpack: {
    devtool: "cheap-module-eval-source-map",
  },
};
