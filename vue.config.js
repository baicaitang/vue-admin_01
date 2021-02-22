const path = require("path");
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "./",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: config => {
    // svg
    config.module.rules.delete('svg');
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(path.resolve('./src/assets/icon'))//处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(path.resolve('src/assets/icon'))
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  },

  configureWebpack: config => {
    config.resolve = {
      // 配置解析别名
      extensions: [".js", ".json", ".vue"], // 自动添加文件名后缀
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@c": path.resolve(__dirname, "./src/components")
      }
    };
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        prependData: `@import "./src/styles/main.scss";`
      }
    }
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: {
      // 后端的接口：http://www.web-jshtml/api/cars   接口：/getCode/
      [process.env.VUE_APP_FLAG]: {
        target: process.env.VUE_APP_APIURL, //跨域API服务器的地址
        changeOrigin: true,
        ws: false, //webscoket
        pathRewrite: {
          [`^${process.env.VUE_APP_FLAG}`]: "" //  查找开头为/process.env.VUE_APP_FLAG 的字符串地址  替换成空字符串"" 只剩下后面的字符串会拼接到target
        }
      }
      // 本地开发环境请求地址：http://www.web-jshtml.cn/api/cars/getCode/

      // 前端的接口：http://www.web-jshtml/api/cars/web
      // [process.env.VUE_APP_API_WEB]: {
      //   target: process.env.VUE_API_DEV_WEB_TARGET, //API服务器的地址
      //   changeOrigin: true,
      //   pathRewrite: {
      //     [`^${process.env.VUE_APP_API_WEB}`]: ''
      // }
      // }
    }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
};
